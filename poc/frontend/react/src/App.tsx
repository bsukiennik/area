import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  addEdge,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/style.css';

type NodeType = 'entry' | 'condition' | 'final';
type WorkflowNode = Node<{ label: string }, NodeType>;

const nodeStyle = {
  padding: 10,
  border: '1px solid #777',
  borderRadius: 4,
  background: '#fff',
};

function EntryNode() {
  return (
    <div style={nodeStyle}>
      Entry
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
}

function ConditionNode() {
  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Left} id="in" />
      Condition
      <Handle type="source" position={Position.Right} id="out-1" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="out-2" style={{ top: '65%' }} />
    </div>
  );
}

function FinalNode() {
  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Left} id="in" />
      Final
    </div>
  );
}

const nodeTypes = {
  entry: EntryNode,
  condition: ConditionNode,
  final: FinalNode,
};

export default function App() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot: any) => changes.applyTo(nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot: any) => changes.applyTo(edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot: any) => addEdge(params, edgesSnapshot)),
    [],
  );

  // Each handle may be used by at most one edge.
  const isValidConnection = useCallback(
    (connection: Connection | Edge) =>
      !edges.some(
        (edge) =>
          (edge.source === connection.source && edge.sourceHandle === connection.sourceHandle) ||
          (edge.target === connection.target && edge.targetHandle === connection.targetHandle),
      ),
    [edges],
  );

  function addNode(type: NodeType) {
    const newNode: WorkflowNode = {
      id: crypto.randomUUID(),
      position: { x: 0, y: 0 },
      type,
      data: { label: type },
    };

    setNodes((nodes) => [...nodes, newNode]);
  }

  return (
    <div style={{ width: 1000, height: 600, border: '1px solid #000000' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <button onClick={() => addNode('entry')}>Add entry</button>
      <button onClick={() => addNode('condition')}>Add condition</button>
      <button onClick={() => addNode('final')}>Add final</button>
    </div>
  );
}
