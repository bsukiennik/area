import { useCallback, useState } from 'react';
import { ReactFlow, Background, Controls, addEdge, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/style.css';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, targetPosition: Position.Left, sourcePosition: Position.Right },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2', deletable: true, markerEnd: { type: MarkerType.ArrowClosed } }];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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

  function addNode() {
    const newNode = {
      id: crypto.randomUUID(),
      position: { x: 0, y: 0 },
      data: { label: 'New node' },
      targetPosition: Position.Left, sourcePosition: Position.Right,
      deletable: true
    };

    // const test = [...nodes, newNode]
    setNodes([...nodes, newNode]);
    setNodes((nodes) => [...nodes, newNode]);

  }

  return (
    <div style={{ width: 1000, height: 600, border: '1px solid #000000' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <button onClick={addNode}>Add node</button>
    </div>
  );
}
