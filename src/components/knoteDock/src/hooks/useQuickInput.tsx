import { Modal } from 'ant-design-vue'
import { getCurrentInstance } from 'vue'

export const useQuickInput = (app?: any) => {
  const appContext = app
  Modal.info({
    title: '快捷输入',
    content: (
      <div>
        <p>快捷输入</p>
        <a-btn>xxx</a-btn>
      </div>
    ),
    onOk() {
      console.log('OK')
    },
    appContext
  })
}
