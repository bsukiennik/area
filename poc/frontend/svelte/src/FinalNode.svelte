<script>
  import { Handle, Position } from '@xyflow/svelte'
</script>

<div class="node">
  <Handle type="target" position={Position.Left} id="in" />
  Final
</div>

<style>
  .node {
    padding: 10px;
    border: 1px solid #777;
    border-radius: 4px;
    background: #fff;
  }
</style>
