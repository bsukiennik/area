<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<template>
  <div class="node">
    <Handle type="target" :position="Position.Left" id="in" connectable="single" />
    Condition
    <Handle type="source" :position="Position.Right" id="out-1" connectable="single" style="top: 35%" />
    <Handle type="source" :position="Position.Right" id="out-2" connectable="single" style="top: 65%" />
  </div>
</template>

<style scoped>
.node {
  padding: 10px;
  border: 1px solid #777;
  border-radius: 4px;
  background: #fff;
}
</style>
