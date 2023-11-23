<template>
  <side-bar title="大纲" :class="{ show: activeSidebar === 'mainPoint' }">
    <div>
      <!--            <a-button-->
      <!--                class="w-full"-->
      <!--                title="出于性能考虑，大纲设定为2秒刷新一次，如果需要最新的大纲，可以手动刷新一下"-->
      <!--                @click="buildTreeData"-->
      <!--                >刷新大纲</a-button-->
      <!--            >-->
      <a-tree :tree-data="treeData">
        <template #title="{ title, _node }">
          <a @click="handleClick(_node)" v-html="title"></a>
        </template>
      </a-tree>
    </div>
  </side-bar>
</template>

<script lang="tsx">
/**
 * 大纲
 */
export default {
  name: 'MainPoint'
}
</script>
<script lang="tsx" setup>
import SideBar from '/src/components/kmindTab/src/components/SideBar/index.vue'
import { creatNamedPublicStore } from '/src/components/kmindTab/src/store/modules/public'
import { inject, toRefs } from 'vue'
import { kmind } from '/src/components/kmindTab/src/hooks/useKmind'
const name = inject('name')
const publicStore = creatNamedPublicStore(name)()
// const { buildTreeData } = publicStore;
const { treeData, activeSidebar } = toRefs(publicStore)
const handleClick = (node: any) => {
  // kmind.value.renderer.clearAllActive();
  // kmind.value.renderer.addActiveNode(node);
  // kmind.value.execCommand('SET_ACTIVE_NODE', node);
  kmind[name].execCommand('SET_NODE_EXPAND', node, true)
  kmind[name].renderer.moveNodeToCenter(node)
  // kmind.value?.execCommand('CLEAR_ACTIVE_NODE');
}
</script>

<style scoped></style>
