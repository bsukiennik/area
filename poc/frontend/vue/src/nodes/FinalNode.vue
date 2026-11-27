<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<template>
  <div class="node">
    <Handle type="target" :position="Position.Left" id="in" connectable="single" />
    Final
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
