<template>
  <div>
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="1" header="当新建一张思维导图的时候，想要它是什么样的呢？">
        <a-row>
          <a-col :span="6">
            <a-form-item label="自动进入禅模式">
              <a-popover content="下个版本开放~"><a-switch v-model:checked="zenMode" disabled /></a-popover>
            </a-form-item>
          </a-col>
          <a-col :span="2" />
          <a-col :span="7">
            <a-form-item label="切换到指定主题">
              <a-popover content="下个版本开放~"><a-select class="w-full" disabled /></a-popover>
            </a-form-item>
          </a-col>
          <a-col :span="2" />
          <a-col :span="7">
            <a-form-item label="切换到指定结构">
              <a-popover content="下个版本开放~"><a-select class="w-full" disabled /></a-popover>
            </a-form-item>
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlobalConfig'
}
</script>

<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref('1')
const zenMode = ref(false)
</script>

<style scoped lang="less"></style>
