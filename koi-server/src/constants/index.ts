export const jwtConstants = {
    secret: 'atYSRR{m;4B0`HlQWkDepbJAuZ+A)EFKrVys} 0o?Mp#{]Mz:VE!f7VcqTM8|&cX`xlij-C Y3NHP{g[>BY7s2`]<Nrkn}(ff ;f'
}

// 依赖级别映射表，用于调整 totalScore
export const CORR_LEVEL = [
    {
        label: '完全级',
        level: 5,
        value: '1-1-1-1-1-1'
    },
    {
        label: '完全级',
        level: 5,
        value: '1-1-1-1-2-1'
    },
    {
        label: '高级',
        level: 4,
        value: '1-1-1-2-1-1'
    },
    {
        label: '高级',
        level: 4,
        value: '1-1-1-2-2-1'
    },
    {
        label: '高级',
        level: 4,
        value: '1-1-2-1-1-1'
    },
    {
        label: '中级',
        level: 3,
        value: '1-1-2-1-2-1'
    },
    {
        label: '中级',
        level: 3,
        value: '1-1-2-2-1-1'
    },
    {
        label: '低级',
        level: 2,
        value: '1-1-2-2-2-1'
    },
    {
        label: '中级',
        level: 3,
        value: '1-2-1-1-1-1'
    },
    {
        label: '中级',
        level: 3,
        value: '1-2-1-1-2-1'
    },
    {
        label: '中级',
        level: 3,
        value: '1-2-1-2-1-1'
    },
    {
        label: '中级',
        level: 3,
        value: '1-2-1-2-2-1'
    },
    {
        label: '低级',
        level: 2,
        value: '1-2-2-1-1-1'
    },
    {
        label: '低级',
        level: 2,
        value: '1-2-2-1-2-1'
    },
    {
        label: '低级',
        level: 2,
        value: '1-2-2-2-1-1'
    },
    {
        label: '低级',
        level: 2,
        value: '1-2-2-2-2-1'
    },
    {
        label: '零级',
        level: 1,
        value: '1-3-1-1-1-1'
    }
]
export const USABILITY = [
    {
        label: '可用',
        value: '1'
    },
    {
        label: '部分模糊',
        value: '2'
    },
    {
        label: '不完整或没有',
        value: '3'
    }
]

export const STATE = [
    {
        label: '正常',
        value: '1'
    },
    {
        label: '能勉强开展工作（如疲劳、生病等）',
        value: '2'
    },
    {
        label: '难以开展工作',
        value: '3'
    }
]

export const MENTAL_STATE = [
    {
        label: '正常',
        value: '1'
    },
    {
        label: '压力高',
        value: '2'
    },
    {
        label: '压力极高',
        value: '3'
    }
]

export const WINDOW_UNIT = [
    {
        label: '分钟',
        value: 1
    },
    {
        label: '小时',
        value: 60
    },
    {
        label: '天',
        value: 1440
    }
]

export const UNIQUE_KEY = {
    可用时间: 'KYSJ',
    压力: 'YL',
    复杂度: 'FZD',
    培训经验: 'PXJY',
    规程: 'GC',
    '人因工程/人机界面': 'RYGC',
    职责适宜: 'ZZSY',
    工作过程: 'GZGC'
}

export const SYSTEM_STATE = [
    {
        label: '启动',
        value: 'start'
    },
    {
        label: '停机',
        value: 'stop'
    },
    {
        label: '运行',
        value: 'run'
    }
]

export const HUMAN_MACHINE_INTERFACE = [
    {
        label: '设备不可用',
        value: '0'
    },
    {
        label: '设备无法提供有效信息',
        value: '1'
    },
    {
        label: '设备提供信息不准确',
        value: '2'
    },
    {
        label: '其他缺失或误导情况',
        value: '3'
    },
    {
        label: '设备标识不清',
        value: '4'
    },
    {
        label: '设备响应不及时',
        value: '5'
    },
    {
        label: '界面布局不合理',
        value: '6'
    },
    {
        label: '界面导航任务繁重',
        value: '7'
    },
    {
        label: '操作界面容易误碰',
        value: '8'
    },
    {
        label: '其他导致任务难以进行的环境与操作界面因素',
        value: '9'
    },
    {
        label: '可支持正常操作',
        value: '10'
    },
    {
        label: '设备易用并支持快速判断操作',
        value: '11'
    }
]

export const PSF_INIT_DATA = [
    // 诊断psf
    {
        name: '可用时间',
        uniqueKey: 'KYSJ',
        type: 1,
        sortNum: 0,
        dictItems: [
            {
                dictLabel: '时间不足',
                dictValue: '20',
                sortNum: 0
            },
            {
                dictLabel: '时间刚好（≈2/3正常时间）',
                dictValue: '10',
                sortNum: 1
            },
            {
                dictLabel: '正常时间',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '额外时间（1-2倍正常时间且＞30分钟）',
                dictValue: '0.1',
                sortNum: 3
            },
            {
                dictLabel: '大量时间（＞2倍正常时间且＞30分钟）',
                dictValue: '0.01',
                sortNum: 4
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 5
            }
        ]
    },
    {
        name: '压力',
        uniqueKey: 'YL',
        type: 1,
        sortNum: 1,
        dictItems: [
            {
                dictLabel: '极端',
                dictValue: '5',
                sortNum: 0
            },
            {
                dictLabel: '高',
                dictValue: '2',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '复杂度',
        uniqueKey: 'FZD',
        type: 1,
        sortNum: 2,
        dictItems: [
            {
                dictLabel: '高复杂',
                dictValue: '5',
                sortNum: 0
            },
            {
                dictLabel: '中等复杂',
                dictValue: '2',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '明显诊断',
                dictValue: '0.1',
                sortNum: 3
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 4
            }
        ]
    },
    {
        name: '培训经验',
        uniqueKey: 'PXJY',
        type: 1,
        sortNum: 3,
        dictItems: [
            {
                dictLabel: '低（小于6个月）',
                dictValue: '10',
                sortNum: 0
            },
            {
                dictLabel: '正常（大于6个月）',
                dictValue: '1',
                sortNum: 1
            },
            {
                dictLabel: '高',
                dictValue: '0.5',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '规程',
        uniqueKey: 'GC',
        type: 1,
        sortNum: 4,
        dictItems: [
            {
                dictLabel: '不可用',
                dictValue: '50',
                sortNum: 0
            },
            {
                dictLabel: '不完整',
                dictValue: '20',
                sortNum: 1
            },
            {
                dictLabel: '可用，但差',
                dictValue: '5',
                sortNum: 2
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 3
            },
            {
                dictLabel: '诊断/症状导向规程',
                dictValue: '0.5',
                sortNum: 4
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 5
            }
        ]
    },
    {
        name: '人因工程/人机界面',
        uniqueKey: 'RYGC',
        type: 1,
        sortNum: 5,
        dictItems: [
            {
                dictLabel: '缺少/失误',
                dictValue: '50',
                sortNum: 0
            },
            {
                dictLabel: '差',
                dictValue: '10',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '良好',
                dictValue: '0.5',
                sortNum: 3
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 4
            }
        ]
    },
    {
        name: '职责适宜',
        uniqueKey: 'ZZSY',
        type: 1,
        sortNum: 6,
        dictItems: [
            {
                dictLabel: '不适宜',
                dictValue: '1',
                sortNum: 0
            },
            {
                dictLabel: '较差的适宜性',
                dictValue: '5',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '工作过程',
        uniqueKey: 'GZGC',
        type: 1,
        sortNum: 7,
        dictItems: [
            {
                dictLabel: '差',
                dictValue: '2',
                sortNum: 0
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 1
            },
            {
                dictLabel: '良好',
                dictValue: '0.8',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    //     执行psf
    {
        name: '可用时间',
        uniqueKey: 'KYSJ',
        type: 2,
        sortNum: 0,
        dictItems: [
            {
                dictLabel: '时间不足',
                dictValue: '20',
                sortNum: 0
            },
            {
                dictLabel: '可用时间≈要求时间',
                dictValue: '10',
                sortNum: 1
            },
            {
                dictLabel: '正常时间',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '可用时间≥5倍要求时间',
                dictValue: '0.1',
                sortNum: 3
            },
            {
                dictLabel: '可用时间≥50倍要求时间',
                dictValue: '0.01',
                sortNum: 4
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 5
            }
        ]
    },
    {
        name: '压力',
        uniqueKey: 'YL',
        type: 2,
        sortNum: 1,
        dictItems: [
            {
                dictLabel: '极端',
                dictValue: '5',
                sortNum: 0
            },
            {
                dictLabel: '高',
                dictValue: '2',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '复杂度',
        uniqueKey: 'FZD',
        type: 2,
        sortNum: 2,
        dictItems: [
            {
                dictLabel: '高复杂',
                dictValue: '5',
                sortNum: 0
            },
            {
                dictLabel: '中等复杂',
                dictValue: '2',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '培训经验',
        uniqueKey: 'PXJY',
        type: 2,
        sortNum: 3,
        dictItems: [
            {
                dictLabel: '低',
                dictValue: '3',
                sortNum: 0
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 1
            },
            {
                dictLabel: '高',
                dictValue: '0.5',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '规程',
        uniqueKey: 'GC',
        type: 2,
        sortNum: 4,
        dictItems: [
            {
                dictLabel: '不可用',
                dictValue: '50',
                sortNum: 0
            },
            {
                dictLabel: '不完整',
                dictValue: '20',
                sortNum: 1
            },
            {
                dictLabel: '可用，但差',
                dictValue: '5',
                sortNum: 2
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 3
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 4
            }
        ]
    },
    {
        name: '人因工程/人机界面',
        uniqueKey: 'RYGC',
        type: 2,
        sortNum: 5,
        dictItems: [
            {
                dictLabel: '缺少/失误',
                dictValue: '50',
                sortNum: 0
            },
            {
                dictLabel: '差',
                dictValue: '10',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '良好',
                dictValue: '0.5',
                sortNum: 3
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 4
            }
        ]
    },
    {
        name: '职责适宜',
        uniqueKey: 'ZZSY',
        type: 2,
        sortNum: 6,
        dictItems: [
            {
                dictLabel: '不适宜',
                dictValue: '1',
                sortNum: 0
            },
            {
                dictLabel: '较差的适宜性',
                dictValue: '5',
                sortNum: 1
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    },
    {
        name: '工作过程',
        uniqueKey: 'GZGC',
        type: 2,
        sortNum: 7,
        dictItems: [
            {
                dictLabel: '差',
                dictValue: '5',
                sortNum: 0
            },
            {
                dictLabel: '正常',
                dictValue: '1',
                sortNum: 1
            },
            {
                dictLabel: '良好',
                dictValue: '0.5',
                sortNum: 2
            },
            {
                dictLabel: '信息不足',
                dictValue: '1',
                sortNum: 3
            }
        ]
    }
]

export const EVENT_TPL = [
    '步骤编码',
    '是否并行',
    '并行步骤的编码',
    '步骤名称',
    '步骤描述',
    '步骤类型',
    '操作提示信息',
    '同时关注信息数量',
    '同时控制的变量数',
    '是否存在干扰',
    '干扰因素描述',
    '涉及岗位',
    '心理状态',
    '所在位置',
    '涉及设备',
    '使用的规程',
    '是否有时间压力',
    '开始时间点(S)',
    '任务要求完成的时间（任务时长）',
    '延迟时长',
    '诊断时长',
    '动作时长',
    '失误类型',
    '失误后如何操作',
    '分析人',
    '分析时间',
    '备注'
]

export const EVENT_TPL_MAPPING = {
    步骤编码: 'code',
    是否并行: 'isParallel',
    并行步骤的编码: 'parallelCode',
    步骤名称: 'name',
    步骤描述: 'desc',
    步骤类型: 'eventType',
    // '操作提示信息',
    同时关注信息数量: 'informationNum',
    同时控制的变量数: 'variableNum',
    是否存在干扰: 'isMainEvent',
    干扰因素描述: 'remarks',
    涉及岗位: 'group',
    心理状态: 'persion',
    所在位置: 'location',
    涉及设备: 'deviceId',
    使用的规程: 'procedure',
    是否有时间压力: 'availableTime',
    '开始时间点(S)': 'startTime',
    '任务要求完成的时间（任务时长）': 'durationTask',
    延迟时长: 'durationDelay',
    诊断时长: 'durationDiagnosis',
    动作时长: 'durationExecute',
    失误类型: 'mistakeType',
    失误后如何操作: 'mainEvent'
    // 分析人: 'analyst',
    // 分析时间: 'analysisDate'
    // '备注'
}

export const TASK_TPL = [
    '任务描述',
    '始发指令',
    '位置',
    '系统状态',
    '操作设备名称',
    '规程编码',
    '规程名称',
    '版本号',
    '规程描述',
    '可用性',
    '岗位名称',
    '工作年限',
    '是否培训',
    '培训类型',
    '上次培训时间',
    '身体状态',
    '沟通是否顺畅',
    '任务计划是否清晰',
    '是否存在与其他部门协调问题',
    '人机接口情况',
    '结束指令'
]

export const TASK_TPL_MAPPING = {
    任务名称: 'name',
    任务编号: 'code',
    任务描述: 'desc',
    始发指令: 'startDirective',
    位置: 'position',
    系统状态: 'state',
    操作设备名称: 'device',
    规程编码: 'proceduresCode',
    规程名称: 'proceduresName',
    版本号: 'version',
    规程描述: 'proceduresDesc',
    可用性: 'usability',
    岗位名称: 'positionName',
    工作年限: 'years',
    是否培训: 'isTraing',
    培训类型: 'traingType',
    培训频次: 'traingRate',
    上次培训时间: 'traingDate',
    身体状态: 'healthy',
    沟通是否顺畅: 'isCommunicate',
    任务计划是否清晰: 'isPlan',
    是否有明确决策人: 'isMaker',
    是否存在与其他部门协调问题: 'isCoordination',
    人机接口情况: 'hmi',
    结束指令: 'endDirective'
}
