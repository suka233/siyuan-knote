import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getFile } from '/src/components/kmindTab/src/api/public'
import { message } from 'ant-design-vue'
import store from '/src/components/kmindTab/src/store'
import { putFile } from '@/api/public'
import dayjs from 'dayjs'
// import * as process from 'process';

export const useNamedPublicStore = {}
export const creatNamedPublicStore = (name: string) => {
  useNamedPublicStore[name] = defineStore(name, () => {
    return {}
  })
  return useNamedPublicStore[name]
}

export const useNamedPublicStoreWithOut = (name: string) => {
  return creatNamedPublicStore(name)(store)
  // return useNamedPublicStore[name](store)
}
