import { notification, Button, TypographyParagraph } from 'ant-design-vue'
import { SmileTwoTone } from '@ant-design/icons-vue'

export const useNotify = () => {
  const key = `open${Date.now()}`
  notification.error({
    message: () => {
      return (
        <div>
          <span class={`font-bold`}>啊哦~</span>没有安装Kmind挂件，暂时没法使用Kmind插件哦~
        </div>
      )
    },
    description: () => {
      return (
        <div>
          <div>
            <span class={`font-bold`}>
              <TypographyParagraph copyable={{ text: '130584086' }}> QQ交流群号：130584086</TypographyParagraph>
            </span>
          </div>
          <div>
            从v1.1.1版本开始，Kmind插件会直接复用Kmind挂件的代码，如果你还没有安装Kmind挂件，请去 设置-集市-挂件
            中，找到kmind<span class={`font-bold`}>挂件</span>
            下载~（如果你已经安装了Kmind挂件，请检查是否更新到了最新版）
          </div>
        </div>
      )
    },
    placement: 'topLeft',
    key,
    btn: () => {
      return (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            notification.close(key)
          }}
        >
          知道了
        </Button>
      )
    },
    icon: <SmileTwoTone />
  })
}
