<script setup>
import { ref, markRaw } from 'vue'
import { VueFlow, MarkerType, addEdge } from '@vue-flow/core'
import EntryNode from './nodes/EntryNode.vue'
import ConditionNode from './nodes/ConditionNode.vue'
import FinalNode from './nodes/FinalNode.vue'

const nodeTypes = markRaw({
  entry: EntryNode,
  condition: ConditionNode,
  final: FinalNode,
})

const nodes = ref([])
const edges = ref([])

function addNode(type) {
  nodes.value.push({
    id: crypto.randomUUID(),
    type,
    position: { x: nodes.value.length * 220, y: 0 },
    data: {},
  })
}

function onConnect(connection) {
  edges.value = addEdge(
    { ...connection, markerEnd: { type: MarkerType.ArrowClosed } },
    edges.value,
  )
}
</script>

<template>
  <div class="wrapper">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :max-zoom="1"
      fit-view-on-init
      @connect="onConnect"
    />
    <div class="buttons">
      <button @click="addNode('entry')">Add entry</button>
      <button @click="addNode('condition')">Add condition</button>
      <button @click="addNode('final')">Add final</button>
    </div>
  </div>
</template>

<style>
.wrapper {
  width: 1000px;
  height: 600px;
  border: 1px solid #000;
}

.buttons {
  padding: 4px;
}
</style>
