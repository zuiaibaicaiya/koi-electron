<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue';

// 类型定义
interface AudioContextRef extends Omit<
  AudioContext,
  'createMediaStreamSource'
> {
  createMediaStreamSource(stream: MediaStream): MediaStreamAudioSourceNode;
}

interface AudioState {
  isRecording: boolean;
  isInitialized: boolean;
  recordingStartTime: number;
  volume: number;
  elapsedTime: number;
  sampleRate: string;
  bufferSize: string;
  status: string;
  statusClass: 'idle' | 'recording' | 'error';
  recordedAudioBlob: Blob | null;
  isProcessing: boolean;
}

// 响应式数据
const canvasRef = ref<HTMLCanvasElement | null>(null);
const audioState = reactive<AudioState>({
  isRecording: false,
  isInitialized: false,
  recordingStartTime: 0,
  volume: 0,
  elapsedTime: 0,
  sampleRate: '--',
  bufferSize: '--',
  status: '准备录音 - 请先选择音频源',
  statusClass: 'idle',
  recordedAudioBlob: null,
  isProcessing: false,
});

// 引用和变量
let audioContext: AudioContextRef | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let mediaStream: MediaStream | null = null;
let dataArray: Uint8Array | null = null;
let animationId: number | null = null;
let timeInterval: NodeJS.Timeout | null = null;

// 录音相关变量
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

// Canvas 上下文
let ctx: CanvasRenderingContext2D | null = null;

// 初始化 Canvas
const initCanvas = () => {
  if (!canvasRef.value) return;

  const container = canvasRef.value.parentElement;
  if (!container) return;

  canvasRef.value.width = container.clientWidth;
  canvasRef.value.height = container.clientHeight;
  ctx = canvasRef.value.getContext('2d');
};

// 获取音频源选项
const showAudioSourceSelector = async (): Promise<MediaStream | null> => {
  try {
    // 方法1: 先尝试使用 getUserMedia 获取麦克风
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 2,
        },
      });

      if (stream.getAudioTracks().length > 0) {
        audioState.status = '已连接麦克风 - 可以开始录音';
        return stream;
      }
    } catch (error) {
      console.log('麦克风访问失败，尝试屏幕共享音频...');
    }

    // 方法2: 尝试获取屏幕共享音频
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true, // macOS Safari 需要明确的音频请求
        video: true, // 必须有视频轨道
      });

      // 检查是否有音频轨道
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        // 提示用户选择音频
        alert(
          '请确保在共享时选择了"共享音频"选项。\n\n在macOS上：\n1. 点击"开始录音"按钮\n2. 在弹出的共享对话框中选择"整个屏幕"或"Chrome标签页"\n3. 勾选底部的"共享音频"复选框',
        );

        // 停止视频轨道以减少资源占用
        stream.getVideoTracks().forEach((track) => track.stop());
        stream.removeTrack(stream.getVideoTracks()[0]);
        return null;
      }

      // 移除视频轨道（只保留音频）
      stream.getVideoTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });

      audioState.status = '已连接系统音频 - 可以开始录音';
      return stream;
    } catch (error) {
      console.log('屏幕共享音频访问失败:', error);
    }

    // 方法3: 如果上述都失败，创建一个空音频上下文用于演示
    audioState.status = '无法访问音频设备 - 使用模拟音频演示';
    return createDummyAudioStream();
  } catch (error) {
    console.error('获取音频源失败:', error);
    return null;
  }
};

// 创建模拟音频流（用于演示）
const createDummyAudioStream = (): MediaStream | null => {
  try {
    // 创建一个虚拟的音频轨道
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const destination = audioContext.createMediaStreamDestination();

    oscillator.connect(destination);
    oscillator.start();

    const stream = destination.stream;
    audioState.status = '使用模拟音频 - 仅用于演示';

    return stream;
  } catch (error) {
    console.error('创建模拟音频失败:', error);
    return null;
  }
};

// 初始化音频
const initAudio = async (): Promise<boolean> => {
  try {
    // 清理现有资源
    cleanup();

    // 创建音频上下文
    audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )() as AudioContextRef;

    // 创建分析器
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // 更新状态
    audioState.sampleRate = `${(audioContext.sampleRate / 1000).toFixed(1)} kHz`;
    audioState.bufferSize = analyser.fftSize.toString();

    // 获取音频流
    audioState.status = '正在请求音频访问权限...';
    audioState.statusClass = 'idle';

    mediaStream = await showAudioSourceSelector();

    if (!mediaStream) {
      throw new Error('用户取消或未选择音频源');
    }

    // 验证音频轨道
    const audioTracks = mediaStream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error('媒体流中没有音频轨道');
    }

    console.log('音频轨道信息:', {
      label: audioTracks[0].label,
      enabled: audioTracks[0].enabled,
      readyState: audioTracks[0].readyState,
    });

    // 创建音频源
    source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    // 初始化 MediaRecorder 用于录音
    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      throw new Error('浏览器不支持录音功能');
    }

    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: mimeType,
      audioBitsPerSecond: 128000,
    });

    // 设置录音数据处理器
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (recordedChunks.length > 0) {
        const audioBlob = new Blob(recordedChunks, {
          type: mediaRecorder?.mimeType || 'audio/webm',
        });
        audioState.recordedAudioBlob = audioBlob;
      }
      audioState.isProcessing = false;
      recordedChunks = [];
    };

    audioState.isInitialized = true;
    audioState.statusClass = 'idle';

    return true;
  } catch (error) {
    console.error('音频初始化错误:', error);
    audioState.status = '音频初始化失败 - 请确保允许音频访问';
    audioState.statusClass = 'error';
    return false;
  }
};

// 获取支持的音频MIME类型
const getSupportedMimeType = (): string | null => {
  const mimeTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/mpeg',
  ];

  for (const mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return null;
};

// 开始录音
const startRecording = () => {
  if (!audioContext || !analyser || !ctx || !mediaRecorder) {
    // 如果未初始化，尝试重新初始化
    initAudio();
    return;
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // 重置录音数据
  recordedChunks = [];
  audioState.recordedAudioBlob = null;

  // 开始录制
  mediaRecorder.start(100);
  audioState.isRecording = true;
  audioState.recordingStartTime = Date.now();
  audioState.status = '录音中...';
  audioState.statusClass = 'recording';

  // 开始动画和时间更新
  updateRecordingTime();
  drawWaveform();
};

// 停止录音
const stopRecording = () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') return;

  audioState.isRecording = false;
  audioState.isProcessing = true;
  audioState.status = '正在处理录音数据...';
  audioState.statusClass = 'idle';

  // 停止录制
  if (mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }

  // 停止动画
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // 清除时间间隔
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};

// 下载录音
const downloadRecording = () => {
  if (!audioState.recordedAudioBlob) {
    alert('没有可下载的录音文件');
    return;
  }

  // 根据MIME类型确定文件扩展名
  const mimeType = mediaRecorder?.mimeType || 'audio/webm';
  let extension = '.webm';

  if (mimeType.includes('ogg')) {
    extension = '.ogg';
  } else if (mimeType.includes('mp4')) {
    extension = '.m4a';
  } else if (mimeType.includes('mpeg')) {
    extension = '.mp3';
  }

  // 生成文件名
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `recording-${timestamp}${extension}`;

  // 创建下载链接
  const url = URL.createObjectURL(audioState.recordedAudioBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// 播放录音
const playRecording = () => {
  if (!audioState.recordedAudioBlob) {
    alert('没有可播放的录音文件');
    return;
  }

  const audioUrl = URL.createObjectURL(audioState.recordedAudioBlob);
  const audioElement = new Audio(audioUrl);

  audioElement.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };

  audioElement.play().catch((error) => {
    console.error('播放失败:', error);
    URL.revokeObjectURL(audioUrl);
  });
};

// 获取录音信息
const getRecordingInfo = () => {
  if (!audioState.recordedAudioBlob) return null;

  const sizeInMB = (audioState.recordedAudioBlob.size / (1024 * 1024)).toFixed(
    2,
  );
  const mimeType = mediaRecorder?.mimeType || '未知格式';
  const duration = audioState.elapsedTime.toFixed(1);

  return {
    size: `${sizeInMB} MB`,
    format: mimeType.split(';')[0],
    duration: `${duration} 秒`,
    sampleRate: audioState.sampleRate,
  };
};

// 重新选择音频源
const selectAudioSource = async () => {
  audioState.status = '正在重新选择音频源...';
  audioState.statusClass = 'idle';

  const success = await initAudio();
  if (success) {
    audioState.status = '音频源已更新 - 可以开始录音';
  }
};

// 重置
const reset = () => {
  stopRecording();

  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }

  audioState.volume = 0;
  audioState.elapsedTime = 0;
  audioState.recordedAudioBlob = null;
  audioState.status = '已重置 - 可以开始新的录音';
  audioState.statusClass = 'idle';
  audioState.isProcessing = false;
};

// 绘制波形
const drawWaveform = () => {
  if (
    !audioState.isRecording ||
    !analyser ||
    !dataArray ||
    !ctx ||
    !canvasRef.value
  ) {
    return;
  }

  const drawFrame = () => {
    if (
      !audioState.isRecording ||
      !analyser ||
      !dataArray ||
      !ctx ||
      !canvasRef.value
    ) {
      return;
    }

    analyser.getByteTimeDomainData(dataArray);
    const { width, height } = canvasRef.value;

    ctx.clearRect(0, 0, width, height);

    // 计算音量
    let sumSquares = 0;
    const dataLength = dataArray.length;
    for (let i = 0; i < dataLength; i++) {
      const value = (dataArray[i] - 128) / 128;
      sumSquares += value * value;
    }

    const rms = Math.sqrt(sumSquares / dataLength);
    audioState.volume = Math.round(rms * 100);

    // 绘制波形
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#4cc9f0';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();

    const sliceWidth = width / dataLength;
    let x = 0;
    const midHeight = height / 2;
    const scaleFactor = height / 2;

    for (let i = 0; i < dataLength; i++) {
      const v = dataArray[i] / 128.0 - 1.0;
      const y = v * scaleFactor + midHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();

    // 绘制填充
    if (audioState.volume > 5) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(76, 201, 240, 0.3)');
      gradient.addColorStop(1, 'rgba(67, 97, 238, 0.05)');

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 绘制网格
    drawGrid();

    // 绘制中心线
    ctx.beginPath();
    ctx.moveTo(0, midHeight);
    ctx.lineTo(width, midHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    animationId = requestAnimationFrame(drawFrame);
  };

  animationId = requestAnimationFrame(drawFrame);
};

// 绘制网格
const drawGrid = () => {
  if (!ctx || !canvasRef.value) return;

  const { width, height } = canvasRef.value;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;

  const verticalLines = 12;
  const horizontalLines = 6;

  for (let i = 1; i < verticalLines; i++) {
    const x = (width / verticalLines) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let i = 1; i < horizontalLines; i++) {
    const y = (height / horizontalLines) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

// 更新录音时间
const updateRecordingTime = () => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }

  timeInterval = setInterval(() => {
    if (!audioState.isRecording) {
      if (timeInterval) clearInterval(timeInterval);
      return;
    }

    audioState.elapsedTime =
      (Date.now() - audioState.recordingStartTime) / 1000;
  }, 100);
};

// 清理资源
const cleanup = () => {
  // 停止动画
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // 清除时间间隔
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }

  // 停止录音器
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }

  // 断开音频连接
  if (source) {
    source.disconnect();
    source = null;
  }

  // 停止媒体流
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  // 关闭音频上下文
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
    audioContext = null;
  }

  // 清除录音数据
  recordedChunks = [];
  mediaRecorder = null;

  analyser = null;
  dataArray = null;
};

// 处理窗口大小变化
let resizeTimeout: NodeJS.Timeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initCanvas();
  }, 150);
};

// 生命周期
onMounted(() => {
  initCanvas();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cleanup();
  window.removeEventListener('resize', handleResize);
  if (resizeTimeout) clearTimeout(resizeTimeout);
});
</script>

<template>
  <div class="container">
    <header>
      <h1><i class="fas fa-wave-square"></i> 实时录音波形图</h1>
      <p class="subtitle">支持麦克风和系统音频录制</p>
    </header>

    <main class="card">
      <div class="visualizer-container">
        <canvas ref="canvasRef" id="waveform-canvas"></canvas>
      </div>

      <div class="status" :class="audioState.statusClass">
        {{ audioState.status }}
        <div v-if="audioState.statusClass === 'error'" class="error-help">
          <button @click="selectAudioSource" class="btn-help">
            <i class="fas fa-redo"></i> 重新选择音频源
          </button>
        </div>
      </div>

      <div class="controls">
        <button
          class="btn btn-record"
          @click="startRecording"
          :disabled="!audioState.isInitialized || audioState.isRecording"
        >
          <i class="fas fa-microphone"></i> 开始录音
        </button>
        <button
          class="btn btn-stop"
          @click="stopRecording"
          :disabled="!audioState.isRecording"
        >
          <i class="fas fa-stop"></i> 停止录音
        </button>
        <button
          class="btn btn-download"
          @click="downloadRecording"
          :disabled="!audioState.recordedAudioBlob || audioState.isProcessing"
        >
          <i class="fas fa-download"></i> 下载录音
        </button>
        <button
          class="btn btn-play"
          @click="playRecording"
          :disabled="!audioState.recordedAudioBlob || audioState.isProcessing"
        >
          <i class="fas fa-play"></i> 播放
        </button>
        <button class="btn btn-reset" @click="reset">
          <i class="fas fa-redo"></i> 重置
        </button>
        <button class="btn btn-select-source" @click="selectAudioSource">
          <i class="fas fa-cog"></i> 选择音频源
        </button>
      </div>

      <div
        v-if="audioState.recordedAudioBlob && !audioState.isProcessing"
        class="recording-info"
      >
        <h3><i class="fas fa-info-circle"></i> 录音信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">文件大小:</span>
            <span class="info-value">{{ getRecordingInfo()?.size }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">格式:</span>
            <span class="info-value">{{ getRecordingInfo()?.format }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">时长:</span>
            <span class="info-value">{{ getRecordingInfo()?.duration }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">采样率:</span>
            <span class="info-value">{{ getRecordingInfo()?.sampleRate }}</span>
          </div>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-box">
          <div class="info-title">采样率</div>
          <div class="info-value">{{ audioState.sampleRate }}</div>
        </div>
        <div class="info-box">
          <div class="info-title">缓冲区大小</div>
          <div class="info-value">{{ audioState.bufferSize }}</div>
        </div>
        <div class="info-box">
          <div class="info-title">录音时长</div>
          <div class="info-value">{{ audioState.elapsedTime.toFixed(1) }}s</div>
        </div>
        <div class="info-box">
          <div class="info-title">音量级别</div>
          <div class="info-value">{{ audioState.volume }}%</div>
        </div>
      </div>

      <div class="instructions">
        <h3>使用说明（macOS特别注意）</h3>
        <ol>
          <li>
            <strong>第一次使用需要授权</strong>：点击"开始录音"会弹出权限请求
          </li>
          <li>
            <strong>选择音频源</strong>：
            <ul>
              <li><strong>麦克风</strong>：直接说话录音</li>
              <li>
                <strong>系统音频</strong>：录制电脑播放的声音（如音乐、视频）
              </li>
            </ul>
          </li>
          <li>
            <strong>录制系统音频步骤</strong>：
            <ol>
              <li>点击"选择音频源"或"开始录音"</li>
              <li>在弹出的对话框中选择"整个屏幕"或"Chrome标签页"</li>
              <li><strong>必须勾选"共享音频"复选框</strong></li>
              <li>点击"共享"</li>
            </ol>
          </li>
          <li>观察实时波形，点击"停止录音"结束</li>
          <li>录音完成后可以下载或播放录制的音频文件</li>
        </ol>

        <div class="browser-tips">
          <h4>浏览器兼容性提示：</h4>
          <ul>
            <li><strong>Chrome/Edge</strong>：支持最好，可以录制系统音频</li>
            <li><strong>Firefox</strong>：可能需要安装扩展来录制系统音频</li>
            <li><strong>Safari</strong>：只能录制麦克风，不支持系统音频录制</li>
          </ul>
        </div>
      </div>
    </main>

    <div class="footer">
      <p>使用Web Audio API和MediaRecorder实现 | 支持录音下载功能</p>
      <p>注意：所有录音数据仅保存在您的浏览器中，不会上传到服务器</p>
    </div>
  </div>
</template>

<style scoped>
/* 新增按钮样式 */
.btn-select-source {
  background: linear-gradient(90deg, #8338ec, #3a86ff);
  color: white;
}

.btn-help {
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-help:hover {
  background: rgba(255, 107, 107, 0.1);
}

.error-help {
  margin-top: 0.5rem;
}

/* 浏览器提示 */
.browser-tips {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border-left: 3px solid #ff9f1c;
}

.browser-tips h4 {
  color: #ff9f1c;
  margin-bottom: 0.5rem;
}

.browser-tips ul {
  padding-left: 1.5rem;
  color: #b8c1ec;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* 原有样式... */
.btn-download {
  background: linear-gradient(90deg, #2ec4b6, #20a39e);
  color: white;
}

.btn-play {
  background: linear-gradient(90deg, #ff9f1c, #ffbf69);
  color: white;
}

/* 录音信息面板 */
.recording-info {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(46, 196, 182, 0.1);
  border-radius: 15px;
  border-left: 4px solid #2ec4b6;
}

.recording-info h3 {
  color: #2ec4b6;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.info-label {
  color: #b8c1ec;
  font-size: 0.9rem;
}

.info-value {
  color: #2ec4b6;
  font-weight: 600;
}

/* 处理中的状态 */
.status:has(~ .recording-info) {
  margin-bottom: 1rem;
}

/* 禁用状态样式 */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 其他原有样式保持不变... */
.visualizer-container {
  contain: strict;
  will-change: contents;
}

#waveform-canvas {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.status.recording {
  animation: pulse 1.5s infinite;
  backface-visibility: hidden;
  transform: translateZ(0);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #4cc9f0, #4361ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(76, 201, 240, 0.2);
}

.subtitle {
  font-size: 1.2rem;
  color: #b8c1ec;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.visualizer-container {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.3);
}

#waveform-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn {
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.btn-record {
  background: linear-gradient(90deg, #f72585, #b5179e);
  color: white;
}

.btn-stop {
  background: linear-gradient(90deg, #7209b7, #560bad);
  color: white;
}

.btn-reset {
  background: linear-gradient(90deg, #3a0ca3, #4361ee);
  color: white;
}

.btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.status {
  text-align: center;
  font-size: 1.3rem;
  padding: 1.2rem;
  border-radius: 15px;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.status.recording {
  background: rgba(247, 37, 133, 0.15);
  color: #f72585;
  border: 2px solid #f72585;
}

.status.idle {
  background: rgba(67, 97, 238, 0.15);
  color: #4361ee;
  border: 2px solid #4361ee;
}

.status.error {
  background: rgba(255, 50, 50, 0.15);
  color: #ff3232;
  border: 2px solid #ff3232;
}

.info-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.info-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.2rem;
  border-radius: 15px;
  text-align: center;
}

.info-title {
  font-size: 0.9rem;
  color: #b8c1ec;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #4cc9f0;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  color: #b8c1ec;
  font-size: 0.9rem;
  line-height: 1.6;
}

.instructions {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border-left: 4px solid #4cc9f0;
}

.instructions h3 {
  color: #4cc9f0;
  margin-bottom: 0.8rem;
}

.instructions ol {
  padding-left: 1.5rem;
  line-height: 1.8;
}

.instructions li {
  margin-bottom: 0.5rem;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 2.2rem;
  }

  .visualizer-container {
    height: 250px;
  }

  .btn {
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
  }

  .controls {
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }

  .visualizer-container {
    height: 200px;
  }

  .controls {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
