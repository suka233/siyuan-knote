import { ref } from 'vue'
import { request } from '@/utils/request'
import zh_CN from '@/i18n/zh_CN.json'
import en_US from '@/i18n/en_US.json'
const locale = ref('zh_CN')
export const useLocale = () => {
  const getLocaleType = async () => {
    const data = await request('/api/system/getConf')
    locale.value = data.conf.lang
  }

  // 临时用于colorMap的desc的切换
  const getLocalKey = (locale: string, prefix = 'desc') => {
    switch (locale) {
      case 'zh_CN':
        return prefix
      case 'en_US':
        return `${prefix}En`
      default:
        return prefix
    }
  }

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.')
    let result: string | undefined
    switch (locale.value) {
      case 'zh_CN':
        result = keys.reduce((prev, curr) => prev && prev[curr], zh_CN)
        break
      case 'en_US':
        result = keys.reduce((prev, curr) => prev && prev[curr], en_US)
        break
      default:
        result = keys.reduce((prev, curr) => prev && prev[curr], zh_CN)
    }

    if (params && result) {
      Object.keys(params).forEach((paramKey) => {
        result = result?.replace(`{${paramKey}}`, params[paramKey])
      })
    }

    return result || key
  }

  return {
    getLocaleType,
    locale,
    getDescKey: getLocalKey,
    t
  }
}
