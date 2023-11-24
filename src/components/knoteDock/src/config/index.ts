import {
  SmileOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  WarningOutlined,
  QuestionCircleOutlined,
  StopOutlined,
  BugOutlined,
  BookOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
interface IColorMap {
  [key: string]: {
    mainColor: string
    secondaryColor: string
    desc?: string
    descEn?: string
    icon?: any
  }
}

export const colorMap: IColorMap = {
  default: {
    mainColor: '#c5c5c5',
    secondaryColor: '#ececec',
    desc: '默认',
    descEn: 'default',
    icon: SmileOutlined
  },
  info: {
    mainColor: '#3889c4',
    secondaryColor: '#eef5f8',
    desc: '信息',
    descEn: 'info',
    icon: InfoCircleOutlined
  },
  light: {
    mainColor: '#ffce52',
    secondaryColor: '#fcf5ee',
    desc: '灵感',
    descEn: 'light',
    icon: BulbOutlined
  },
  bell: {
    mainColor: '#ffae30',
    secondaryColor: '#faf0e6',
    desc: '提醒',
    descEn: 'bell',
    icon: BellOutlined
  },
  check: {
    mainColor: '#79b453',
    secondaryColor: '#eef6f0',
    desc: '正确',
    descEn: 'check',
    icon: CheckCircleOutlined
  },
  wrong: {
    mainColor: '#de2a42',
    secondaryColor: '#fdf1f1',
    desc: '错误',
    descEn: 'wrong',
    icon: CloseOutlined
  },
  warn: {
    mainColor: '#ffcd4c',
    secondaryColor: '#fdf9ed',
    desc: '警告',
    descEn: 'warn',
    icon: WarningOutlined
  },
  question: {
    mainColor: '#bf122d',
    secondaryColor: '#f9eff5',
    desc: '问题',
    descEn: 'question',
    icon: QuestionCircleOutlined
  },
  error: {
    mainColor: '#de2a42',
    secondaryColor: '#fdf1f1',
    desc: '禁止',
    descEn: 'error',
    icon: StopOutlined
  },
  bug: {
    mainColor: '#9366cd',
    secondaryColor: '#f4f1f8',
    desc: 'bug',
    descEn: 'bug',
    icon: BugOutlined
  },
  note: {
    mainColor: '#6c7c85',
    secondaryColor: '#e2e5e7',
    desc: '注记',
    descEn: 'note',
    icon: BookOutlined
  },
  pen: {
    mainColor: '#293137',
    secondaryColor: '#f5f5f6',
    desc: '记录',
    descEn: 'pen',
    icon: EditOutlined
  }
}

// 快捷输入文字指令map
/**
 * yd,移动,/yd,/移动,yidong : 快捷使用键盘移动mainWin位置
 */
export const quickCommandMap = [
  // {
  //   key: 'yd|移动|/yd|/移动|yidong|set|/set|move|/move',
  //   description: '快捷使用键盘移动mainWin位置',
  //   command: 'move'
  // },
  // // lock
  // {
  //   key: 'lock|/lock|unlock|/unlock',
  //   description: '锁定/解锁',
  //   command: 'lock'
  // },
  //default
  {
    key: 'default|/default',
    description: 'default',
    command: 'default'
  },
  // info
  {
    key: 'info|/info',
    description: 'info',
    command: 'info'
  },
  // light
  {
    key: 'light|/light',
    description: 'light',
    command: 'light'
  },
  // bell
  {
    key: 'bell|/bell',
    description: 'bell',
    command: 'bell'
  },
  // check
  {
    key: 'check|/check',
    description: 'check',
    command: 'check'
  },
  // wrong
  {
    key: 'wrong|/wrong',
    description: 'wrong',
    command: 'wrong'
  },
  // warn
  {
    key: 'warn|/warn',
    description: 'warn',
    command: 'warn'
  },
  // question
  {
    key: 'question|/question',
    description: 'question',
    command: 'question'
  },
  // error
  {
    key: 'error|/error',
    description: 'error',
    command: 'error'
  },
  // bug
  {
    key: 'bug|/bug',
    description: 'bug',
    command: 'bug'
  },
  // note
  {
    key: 'note|/note',
    description: 'note',
    command: 'note'
  },
  // pen
  {
    key: 'pen|/pen',
    description: 'pen',
    command: 'pen'
  }
]
