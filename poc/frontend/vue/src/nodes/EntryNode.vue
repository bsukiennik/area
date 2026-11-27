<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<template>
  <div class="node">
    Entry
    <Handle type="source" :position="Position.Right" id="out" connectable="single" />
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
