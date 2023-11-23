export class ConfigModel {
  id: string;
  //是否锁定于桌面，主窗口位置和大小，发送到思源笔记的方式，指定的特定笔记的文档id，指定的dailyNote的笔记本id，思源的API token
  /**
   * 是否锁定于桌面
   */
  isLock: boolean;
  /**
   * 主窗口位置和大小
   */
  mainWinX: number;
  mainWinY: number;
  mainWinWidth: number;
  mainWinHeight: number;
  /**
   * 发送到思源笔记的方式
   */
  sendToSiYuanMode: string;
  /**
   * 指定的特定笔记的文档id
   */
  specifyNoteId: string;
  /**
   * 指定的dailyNote的笔记本id
   */
  dailyNotebookId: string;
  /**
   * 思源的API token
   */
  siyuanToken: string;
}
