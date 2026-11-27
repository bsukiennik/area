<script>
  import { Handle, Position } from '@xyflow/svelte'
</script>

<div class="node">
  <Handle type="target" position={Position.Left} id="in" />
  Condition
  <Handle type="source" position={Position.Right} id="out-1" style="top: 35%" />
  <Handle type="source" position={Position.Right} id="out-2" style="top: 65%" />
</div>

<style>
  .node {
    padding: 10px;
    border: 1px solid #777;
    border-radius: 4px;
    background: #fff;
  }
</style>
