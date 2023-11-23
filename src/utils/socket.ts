import { getAppID, genUUID } from './id'
interface handlers {
  [key: string]: Function[]
}

//https://github.com/siyuan-note/siyuan/blob/master/app/src/layout/Model.ts

export class Socket {
  public ws: WebSocket
  public handlers: handlers

  constructor() {
    this.handlers = {}
    this.ws = this.connect()
  }
  private connect() {
    const url = 'ws://127.0.0.1:6806/ws'
    const ws = new WebSocket(`${url}?app=${getAppID()}&id=${genUUID()}`)
    ws.onopen = () => {}
    ws.onmessage = (event) => {
      const _data = JSON.parse(event.data)
      const { cmd, data } = _data
      console.log(_data)
      this.emit(cmd, data)
      // this.emit('all', data);
    }
    ws.onclose = (ev) => {
      if (0 <= ev.reason.indexOf('unauthenticated')) {
        return
      }
      if (0 > ev.reason.indexOf('close websocket')) {
        console.warn('WebSocket is closed. Reconnect will be attempted in 3 second.', ev)
        setTimeout(() => {
          this.connect()
        }, 3000)
      }
    }
    ws.onerror = (err) => {
      console.error(err)
    }
    return ws
  }
  emit(cmd: string, data: any) {
    if (this.handlers[cmd]) {
      this.handlers[cmd].forEach((callback) => {
        callback(JSON.parse(JSON.stringify(data)))
      })
    }
  }
  all(...callbacks: Function[]) {
    this.on('all', ...callbacks)
  }
  on(cmd: string, ...callbacks: Function[]) {
    if (!this.handlers[cmd]) {
      this.handlers[cmd] = []
    }
    callbacks.forEach((callback) => {
      this.handlers[cmd].push(callback)
    })
  }
  off(cmd: string, ...callbacks: Function[]) {
    if (this.handlers[cmd]) {
      this.handlers[cmd].filter((func) => {
        let flag = true
        for (const callback of callbacks) {
          if (func === callback) {
            flag = false
            break
          }
        }
        return flag
      })
    }
  }
  once(cmd: string, ...callbacks: Function[]) {
    this.handlers[cmd].push((...args: any[]) => {
      callbacks.forEach((callback) => {
        callback(...args)
      })
      this.off(cmd, ...callbacks)
    })
  }
  send(cmd: string, param: number, process = false) {
    const reqId = process ? 0 : new Date().getTime()
    this.ws.send(
      JSON.stringify({
        cmd,
        reqId: reqId,
        param
        // pushMode
        // 0: 所有应用所有会话广播
        // 1：自我应用会话单播
        // 2：非自我会话广播
        // 4：非自我应用所有会话广播
        // 5：单个应用内所有会话广播
        // 6：非自我应用主会话广播
      })
    )
  }
}
//cmd可能的种类：
/*    "moveDoc":
     "mount":
     "createnotebook":
     "unmount":
     "removeDoc":
     "createdailynote":
     "create":
     "heading2doc":
     "li2doc":
     "renamenotebook":
     "rename":
     "progress":
*/
