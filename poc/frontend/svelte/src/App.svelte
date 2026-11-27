<script>
  import { SvelteFlow, MarkerType } from '@xyflow/svelte'
  import EntryNode from './EntryNode.svelte'
  import ConditionNode from './ConditionNode.svelte'
  import FinalNode from './FinalNode.svelte'

  const nodeTypes = {
    entry: EntryNode,
    condition: ConditionNode,
    final: FinalNode,
  }

  let nodes = $state([])
  let edges = $state([])

  // Each handle may be used by at most one edge.
  function isValidConnection(connection) {
    return !edges.some(
      (edge) =>
        (edge.source === connection.source && edge.sourceHandle === connection.sourceHandle) ||
        (edge.target === connection.target && edge.targetHandle === connection.targetHandle),
    )
  }

  function addNode(type) {
    nodes = [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type,
        position: { x: nodes.length * 220, y: 0 },
        data: {},
      },
    ]
  }
</script>

<div class="wrapper">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    {isValidConnection}
    defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
    fitViewOptions={{ maxZoom: 1 }}
    fitView
  />
</div>
<div class="buttons">
  <button onclick={() => addNode('entry')}>Add entry</button>
  <button onclick={() => addNode('condition')}>Add condition</button>
  <button onclick={() => addNode('final')}>Add final</button>
</div>

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
