<template>
  <div>
    <!--    视频窗口区域-->
    <video controls :src="videoSrc" class="w-80%"></video>

    <!--    protyle区域-->
    <div class="kvideo-protyle" ref="protyleRef"></div>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { Protyle } from 'siyuan'
const videoId: string | undefined = inject('videoId')
const videoUrl: string | undefined = inject('videoUrl')
// // 'http://127.0.0.1:61705/assets/t-20230911142841-s3y5n9d-20230919103319-m02p9ax.mp4'
const videoSrc = `assets${videoUrl!.split('assets')[1]}`
// console.log(videoSrc)
// import { useSql } from '@/hooks/useSql'
// const { useBlockSql } = useSql()
// const { rootId: docId } = await useBlockSql(videoId!)
// 给主文档末尾插入一块空白块，拿到该块id
</script>

<style scoped></style>
