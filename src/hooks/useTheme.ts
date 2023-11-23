import { request } from '@/utils/request'

// 设置明暗切换
export async function useTheme() {
  const data = await request('/api/system/getConf')
  const themeMode = data.conf.appearance.mode

  switch (themeMode) {
    case 1:
      document.body.setAttribute('arco-theme', 'dark')
      break
    case 0:
    default:
      document.body.removeAttribute('arco-theme')
      break
  }
}
