<template>
  <div>
    <a-button @click="getImg">get</a-button>
  </div>
</template>
<script setup lang="tsx">
// 根据本地读取的数据，动态生成css标签插入到head中
// 列出本地资源文件，根据文件名匹配配置文件，根据配置文件生成css插入到head中

import { getFileToBase64 } from '@/api/public'

const getImg = () => {
  getFileToBase64('/data/plugins/knote-plugin/img/info.svg').then((res) => {
    console.log(res)
  })
}
</script>

<style lang="less">
// 集市里的插件页面的引述也会有这俩东西[data-type='NodeBlockquote'].bq，所以再加上[updated]选择器
[data-type='NodeBlockquote'].bq[updated] {
  // 第一个子元素搞成加粗。后续可以自定义这个配置
  &[custom-b] > :first-child {
    font-weight: bold;
    padding-left: 2rem;

    &::before {
      content: '';
      position: absolute;
      // 因为有padding-left: 2rem;，所以这里要设置成0，才能贴边
      left: 0;
      // 宽高调整大小，后续可以动态设置，需要注意的是，这个设置了的话，padding-left也要同步增加，间隔0.5rem
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>
