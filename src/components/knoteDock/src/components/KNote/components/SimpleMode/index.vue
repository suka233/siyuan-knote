<template>
  <div class="包裹 m-2 relative">
    <v-card
      transition="scale-transition"
      link
      hover
      class="内容区域 cursor-pointer text-right"
      @click="goSiYuan"
      :disabled="props.data.showMode === 'sticky'"
      >{{ data.title ?? data.content }}</v-card
    >
    <!--    <v-card class="操作按钮" v-show="!isLock">-->
    <!--      <si-yuan-icon class="cursor-pointer" @click="sendToSiYuan" />-->
    <!--      &lt;!&ndash;      <delete-outlined class="text-gray-5 ml-2 cursor-pointer" @click="deleteOne" />&ndash;&gt;-->
    <!--      <v-icon icon="mdi-delete" class="图标 !text-gray !text-5 cursor-pointer" />-->
    <!--      &lt;!&ndash;      <v-btn size="x-small" density="compact" icon="mdi-export" @click="goStickyNote" color="transparent" />&ndash;&gt;-->
    <!--      <v-icon icon="mdi-export" class="图标 !text-gray !text-5 cursor-pointer" />-->
    <!--    </v-card>-->
  </div>
</template>

<script setup lang="ts">
import SiYuanIcon from '../../../SiYuanIcon/index.vue'
import { colorMap } from '../../../../config'
import { useData } from '@/components/knoteDock/src/hooks/useData'
import { message } from 'ant-design-vue'
import type { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { appendBlock, setBlockAttrs } from '@/api/public'

const props = defineProps<{
  data: KNoteModel
}>()
const { specifyNoteId } = useData()

const goSiYuan = () => {
  window.open(`siyuan://blocks/${props.data.id}`)
}
</script>

<style scoped lang="less">
.包裹 {
  display: flex;
  // 子元素右对齐
  justify-content: flex-end;

  .内容区域 {
    // 单行溢出
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    border-radius: 1rem 0 0 1rem;
    background-color: #cccccc;

    padding: 0.5rem;

    min-width: 5rem;

    border-left-width: 0.2rem;
    border-left-color: v-bind('colorMap?.[props.data.type]?.mainColor ?? `white`');
    background-color: v-bind('colorMap?.[props.data.type]?.secondaryColor ?? `white`');
  }

  .操作按钮 {
    // 右边的border-radius为1rem
    border-radius: 0 1rem 1rem 0;
    // 背景颜色从左向右渐变，透明到白色
    //background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    background: #eaeaec;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    //padding: 0.5rem;

    // 此flex子元素设置为不压缩
    flex-shrink: 0;

    min-width: 5rem;

    display: flex;
    justify-content: space-evenly;
    align-items: center;
    //background-color: v-bind('colorMap?.[props.data.type]?.secondaryColor ?? `white`');
    //.图标 {
    //  color: v-bind('colorMap?.[props.data.type]?.mainColor ?? `white`') !important;
    //}
  }
}
</style>
