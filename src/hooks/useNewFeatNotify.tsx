import { notification, Button } from 'ant-design-vue'
import { SmileTwoTone } from '@ant-design/icons-vue'
import { useFile } from '@/hooks/useFile'

export const useNewFeatNotify = async () => {
  const { isShowNewFeatNotify, setShowNewFeatNotify } = useFile()
  const isShowed = await isShowNewFeatNotify()
  if (!isShowed) {
    const key = `open${Date.now()}`
    notification.error({
      message: () => {
        return (
          <div>
            <span class={`font-bold`}>重要通知</span>：老版本插件版Kmind尚有缺陷，请仔细阅读本通知
          </div>
        )
      },
      description: () => {
        return (
          <div>
            <div>
              <span class={`font-bold`}>QQ交流群号：130584086</span>
            </div>
            <div>
              由于多tab页的数据复杂性，v1.1.1之前插件版Kmind会有{' '}
              <span class={`font-bold`}>拖拽节点时节点丢失的bug</span>{' '}
              （kmind挂件为单一数据源，所以无此问题），所幸我已经找到了解决方案，
              请将kmind的挂件版本和插件版本都升级到v1.1.1或者之后的版本，即可完美解决此问题。
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
              setShowNewFeatNotify()
              notification.close(key)
            }}
          >
            知道了，以后不再显示此通知
          </Button>
        )
      },
      icon: <SmileTwoTone />
    })
  }
}
