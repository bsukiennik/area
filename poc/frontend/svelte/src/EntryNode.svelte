<script>
  import { Handle, Position } from '@xyflow/svelte'
</script>

<div class="node">
  Entry
  <Handle type="source" position={Position.Right} id="out" />
</div>

<style>
  .node {
    padding: 10px;
    border: 1px solid #777;
    border-radius: 4px;
    background: #fff;
  }
</style>
