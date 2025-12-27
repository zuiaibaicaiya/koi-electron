const TerserPlugin = require('terser-webpack-plugin');
const fs = require('node:fs');
const path = require('node:path');
const bytenode = require('bytenode');
class ByteNodeWebpackPlugin {
  constructor(options = { electron: true }) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap(
      'ByteNodeWebpackPlugin',
      async (compilation) => {
        const outputPath = compilation.outputOptions.path;
        const outputFile = path.join(
          outputPath,
          compilation.outputOptions.filename,
        );
        try {
          // 使用 bytenode 编译生成的 JS 文件
          await bytenode.compileFile({
            electron: this.options.electron,
            filename: outputFile,
          });
          // 删除原始的 JS 文件，只保留 .jsc 文件
          fs.unlinkSync(outputFile);
          fs.writeFileSync(
            outputFile,
            "require('bytenode');module.exports = require('./main.jsc')",
          );
        } catch (error) {
          console.error('bytenode compilation failed:', error);
        }
      },
    );
  }
}

module.exports = (options) => {
  options.plugins.push(
    new ByteNodeWebpackPlugin({
      electron: true, // 设为 true 如果是 Electron 应用
    }),
  );
  return {
    ...options,
    externals: {
      sqlite3: 'commonjs sqlite3',
      '@nestjs/swagger': 'commonjs @nestjs/swagger',
      bcrypt: 'commonjs bcrypt',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true, // 保持所有类名不被混淆
            format: {
              comments: false, // 移除所有注释
            },
          },
          extractComments: false, // 不提取注释到单独文件
        }),
      ],
    },
  };
};
