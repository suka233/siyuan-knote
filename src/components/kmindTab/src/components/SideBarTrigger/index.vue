<template>
  <div
    class="side-bar-trigger-container animate-animated animate-slideInLeft absolute left-5 top-20"
    :class="{ show: activeSidebar }"
  >
    <div class="trigger flex flex-col">
      <div
        v-for="item in sideBarTriggerList"
        :key="item.value"
        class="trigger-item flex items-center justify-center"
        :class="{ active: activeSidebar === item.value }"
        @click="activeSidebar === item.value ? setActiveSidebar('') : setActiveSidebar(item.value)"
      >
        <component :is="item.icon" class="trigger-icon" />
        <div class="trigger-name">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
export default {
  name: 'SideBarTrigger'
}
</script>

<script lang="tsx" setup>
import { inject, toRefs } from 'vue'
import { creatNamedPublicStore } from '/src/components/kmindTab/src/store/modules/public'
import { sideBarTriggerList } from '/src/components/kmindTab/src/config/zh'
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
const { setActiveSidebar } = publicStore
const { activeSidebar } = toRefs(publicStore)
</script>

<style scoped lang="less">
.side-bar-trigger-container {
  transition: all 0.3s;

  &.show {
    left: 305px;
  }

  .trigger {
    width: 60px;
    border-color: #eee;
    background-color: #fff;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    overflow: hidden;

    .trigger-item {
      flex-direction: column;
      height: 60px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #e6e6e6;
      }

      &.active {
        color: #409eff;
        font-weight: bold;
      }

      .trigger-icon {
        font-size: 20px;
        margin-bottom: 5px;
      }

      .trigger-name {
        font-size: 13px;
      }
    }
  }
}
</style>
