<template>
  <div
    class="包裹 p-3px relative"
    @mouseenter="handleMouseOver"
    @mouseleave.self="handleMouseOut"
    title="Alt+左键单击即可悬浮预览"
  >
    <!--    <v-card-->
    <!--      transition="scale-transition"-->
    <!--      link-->
    <!--      hover-->
    <!--      @mouseover="handleMouseOver"-->
    <!--      @mouseout="handleMouseOut"-->
    <!--      class="内容区域 cursor-pointer text-right"-->
    <!--      @click="goSiYuan"-->
    <!--      :disabled="props.data.showMode === 'sticky'"-->
    <!--      >{{ data.title ?? data.content }}</v-card-->
    <!--    >-->
    <div class="内容区域 cursor-pointer text-right" @click="goSiYuan">
      <span>{{ data.title ?? data.content }}</span>
    </div>
    <!--    <div class="覆盖操作栏" v-show="isHover">xxx</div>-->
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
import { colorMap } from '../../../../config'
import type { KNoteModel } from '@/components/knoteDock/src/model/KNoteModel'
import { inject, onUnmounted, ref } from 'vue'
import { Plugin } from 'siyuan'
const plugin = inject('plugin')
const props = defineProps<{
  data: KNoteModel
}>()

const goSiYuan = (e: MouseEvent) => {
  if (e.altKey) {
    return (plugin as Plugin).addFloatLayer({
      ids: [props.data.id],
      x: e.screenX,
      // 向下移动10像素，避免挡着鼠标
      y: e.screenY + 10
    })
  }
  window.openFileByURL(`siyuan://blocks/${props.data.id}`)
}

// region 悬浮2秒自动打开浮窗
let timer = ref(null)
const isHover = ref(false)
const handleMouseOver = (e) => {
  return (isHover.value = true)
  timer.value = setTimeout(() => {
    ;(plugin as Plugin).addFloatLayer({
      ids: [props.data.id],
      x: e.screenX,
      // 向下移动10像素，避免挡着鼠标
      y: e.screenY + 10
    })
  }, 500)
}

const handleMouseOut = () => {
  return (isHover.value = false)
  clearTimeout(timer.value)
}

onUnmounted(() => {
  clearTimeout(timer.value)
})
// endregion
</script>

<style scoped lang="less">
.悬浮 {
  left: -10px;
}
.覆盖操作栏 {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 1rem 0 0 1rem;
  border-left-width: 0.2rem;
  border-left-style: solid;
  border-left-color: v-bind('colorMap?.[props.data.type]?.mainColor ?? `white`');
  /* 添加毛玻璃效果 */
  backdrop-filter: blur(10px);

  /* 初始时，蒙层是透明的 */
  background: rgba(255, 255, 255, 0);

  /* 添加过渡效果，使蒙层的出现和消失更平滑 */
  transition: all 0.3s ease-in-out;
}

.包裹 {
  display: flex;
  // 子元素右对齐
  justify-content: flex-end;
  //height: 46px;

  .内容区域 {
    position: relative;
    // 单行溢出
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    border-radius: 1rem 0 0 1rem;
    background-color: #cccccc;

    padding: 0.5rem;

    min-width: 5rem;

    border-left-width: 0.2rem;
    border-left-style: solid;
    border-left-color: v-bind('colorMap?.[props.data.type]?.mainColor ?? `white`');
    background-color: v-bind('colorMap?.[props.data.type]?.secondaryColor ?? `white`');

    transition: box-shadow 0.3s ease-in-out; /* 添加过渡效果 */

    position: relative;

    &:hover {
      // 四周阴影 颜色为主颜色
      box-shadow: 1px 1px 6px #5f6368;
    }

    .操作区域 {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border-radius: 1rem 0 0 1rem;
      border-left-width: 0.2rem;
      border-left-style: solid;
      background-color: v-bind('colorMap?.[props.data.type]?.mainColor ?? `white`');
      z-index: -1;
    }
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
