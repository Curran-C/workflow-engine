# Workflow Engine

A powerful, event-driven node-based workflow builder for React. Build complex workflows with custom nodes, visual connections, and reactive data flow - similar to n8n or React Flow.

## Features

- 🎨 **Visual Node Editor** - Drag-and-drop nodes with beautiful Bezier curve connections
- ⚡ **Event-Driven Architecture** - Nodes communicate through a flexible `emit`/`on` pattern
- 🔄 **Reactive Data Flow** - Automatic UI updates when node data changes
- 🧩 **Extensible** - Easily create custom node types with React components
- 🎯 **TypeScript Support** - Full TypeScript support with type-safe hooks
- 📦 **Zero Dependencies** - Only requires React (no heavy dependencies)

## Installation

```bash
npm i workflow-engine
```

## Quick Start

```tsx
import { Graph } from 'workflow-engine';
import Node from 'workflow-engine/components/Node';
import EdgesLayer from 'workflow-engine/components/Edge/EdgeLayer';

// Define your nodes
const initialNodes = [
  {
    id: "node1",
    initialPosition: { x: 100, y: 100 },
    type: "myNode",
    data: { label: "My Node" },
  },
];

// Define connections
const initialEdges = [
  { id: "e1", source: "node1", target: "node2" },
];

// Create graph instance
const graph = new Graph(initialNodes, initialEdges);

// Define node types (React components)
const nodeTypes = {
  myNode: MyNodeComponent,
};

// Render
function App() {
  return (
    <div className="graph-canvas" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {graph.getNodes().map((node) => {
        const hasSource = graph.getOutgoingEdges(node).length > 0;
        const hasTarget = graph.getIncomingEdges(node).length > 0;
        
        return (
          <Node
            key={node.getId()}
            node={node}
            source={hasSource}
            target={hasTarget}
            types={nodeTypes}
          />
        );
      })}
      <EdgesLayer graph={graph} />
    </div>
  );
}
```

## Usage Examples

### Example 1: Simple Data Flow

```tsx
import { Graph } from 'workflow-engine';
import { useNodeData, useEmit, useOn } from 'workflow-engine/components/Node/hooks';

// Source Node Component
function NumberSource() {
  const emit = useEmit();
  
  const handleClick = () => {
    emit("data", { value: Math.random() * 100 });
  };
  
  return (
    <div style={{ padding: "10px" }}>
      <button onClick={handleClick}>Generate Number</button>
    </div>
  );
}

// Processor Node Component
function NumberProcessor() {
  const data = useNodeData<{ processed?: number }>();
  const emit = useEmit();
  
  useOn("data", (payload) => {
    const processed = payload.value * 2;
    emit("data", { ...payload, processed });
  });
  
  return (
    <div style={{ padding: "10px" }}>
      <div>Processed: {data.processed || 0}</div>
    </div>
  );
}

// Setup
const graph = new Graph(
  [
    { id: "source", initialPosition: { x: 50, y: 50 }, type: "source", data: { label: "Source" } },
    { id: "processor", initialPosition: { x: 250, y: 50 }, type: "processor", data: { label: "Processor" } },
  ],
  [{ id: "e1", source: "source", target: "processor" }]
);

const nodeTypes = {
  source: NumberSource,
  processor: NumberProcessor,
};
```

### Example 2: Conditional Branching

```tsx
function ConditionalNode() {
  const emit = useEmit();
  
  useOn("data", (payload) => {
    if (payload.value > 50) {
      emit("high", payload);  // Route to "high" branch
    } else {
      emit("low", payload);   // Route to "low" branch
    }
  });
  
  return <div>Conditional Branch</div>;
}

// Connect to different targets based on event type
const edges = [
  { id: "e1", source: "condition", target: "highProcessor" },  // Receives "high" events
  { id: "e2", source: "condition", target: "lowProcessor" },   // Receives "low" events
];
```

### Example 3: Data Accumulation

```tsx
function AccumulatorNode() {
  const data = useNodeData<{ count?: number; items?: any[] }>();
  const setData = useSetNodeData();
  const emit = useEmit();
  const itemsRef = useRef<any[]>([]);
  
  useOn("item", (payload) => {
    itemsRef.current.push(payload);
    setData({ 
      count: itemsRef.current.length,
      items: [...itemsRef.current]
    });
  });
  
  useOn("complete", () => {
    emit("data", { 
      items: itemsRef.current,
      count: itemsRef.current.length 
    });
    itemsRef.current = [];
  });
  
  return (
    <div>
      <div>Collected: {data.count || 0} items</div>
    </div>
  );
}
```

### Example 4: Merging Multiple Sources

```tsx
function MergeNode() {
  const data = useNodeData<{ sources?: Record<string, any> }>();
  const setData = useSetNodeData();
  const emit = useEmit();
  
  useOn("data", (payload, from) => {
    const sources = { ...(data.sources || {}), [from]: payload };
    setData({ sources });
    
    // Emit when all sources have sent data
    if (Object.keys(sources).length === 2) {
      emit("data", { merged: sources });
    }
  });
  
  return <div>Merge Node</div>;
}
```

## API Reference

### Graph Class

```tsx
class Graph {
  constructor(
    initialNodes: NodeInterface[],
    initialEdges: EdgeInterface[],
    nodeTypes?: NodeType
  );
  
  getNodes(): Node[];
  getEdges(): Edge[];
  getNodeById(id: string): Node | undefined;
  getOutgoingEdges(node: Node): Edge[];
  getIncomingEdges(node: Node): Edge[];
  emit(fromId: string, type: string, payload: any): void;
}
```

### Node Hooks

#### `useNodeData<T>()`

Get the current node's data. Automatically triggers re-renders when data changes.

```tsx
const data = useNodeData<{ count: number }>();
```

#### `useSetNodeData<T>()`

Update the node's data. Returns a callback function.

```tsx
const setData = useSetNodeData<{ count: number }>();
setData({ count: 5 });
```

#### `useEmit()`

Emit an event to connected nodes. Returns a callback function.

```tsx
const emit = useEmit();
emit("data", { value: 42 });
emit("error", { message: "Something went wrong" });
```

#### `useOn(type: string, handler: (payload: any, from: string) => void)`

Listen for events from connected nodes. Automatically cleans up on unmount.

```tsx
useOn("data", (payload, from) => {
  console.log("Received data:", payload, "from:", from);
});
```

### Type Definitions

```tsx
interface NodeInterface {
  id: string;
  initialPosition: { x: number; y: number };
  type: string;
  data: NodeData;
}

interface EdgeInterface {
  id: string;
  source: string;
  target: string;
}

interface NodeData {
  type?: string;
  label: string;
  [key: string]: any;
}
```

## Creating Custom Nodes

Creating custom nodes is straightforward. Just create a React component and use the provided hooks:

```tsx
import { useNodeData, useSetNodeData, useEmit, useOn } from 'workflow-engine/components/Node/hooks';

interface MyNodeData {
  value?: number;
  status?: string;
}

function MyCustomNode({ label = "My Node" }: { label?: string }) {
  // Access node data (reactive)
  const data = useNodeData<MyNodeData>();
  
  // Update node data
  const setData = useSetNodeData<MyNodeData>();
  
  // Emit events to connected nodes
  const emit = useEmit();
  
  // Listen for events from connected nodes
  useOn("data", (payload, from) => {
    // Process incoming data
    const processed = payload.value * 2;
    setData({ value: processed, status: "processed" });
    emit("data", { ...payload, processed });
  });
  
  return (
    <div style={{ padding: "10px", minWidth: "120px" }}>
      <div style={{ fontSize: "12px", fontWeight: "600" }}>{label}</div>
      <div>Value: {data.value || 0}</div>
      <div>Status: {data.status || "idle"}</div>
    </div>
  );
}

// Register in your nodeTypes
const nodeTypes = {
  myCustom: MyCustomNode,
};
```

## Advanced Patterns

### Multiple Event Types

Nodes can emit and listen to multiple event types for complex routing:

```tsx
function RouterNode() {
  const emit = useEmit();
  
  useOn("data", (payload) => {
    switch (payload.type) {
      case "A":
        emit("typeA", payload);
        break;
      case "B":
        emit("typeB", payload);
        break;
      default:
        emit("default", payload);
    }
  });
}
```

### Async Operations

Handle async operations in nodes:

```tsx
function AsyncNode() {
  const emit = useEmit();
  const setData = useSetNodeData();
  
  useOn("data", async (payload) => {
    setData({ status: "loading" });
    
    try {
      const result = await fetch("/api/process", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await result.json();
      emit("data", data);
      setData({ status: "success" });
    } catch (error) {
      emit("error", { error });
      setData({ status: "error" });
    }
  });
}
```

### State Management

Use refs for state that shouldn't trigger re-renders:

```tsx
function StatefulNode() {
  const data = useNodeData();
  const emit = useEmit();
  const cacheRef = useRef(new Map());
  
  useOn("data", (payload) => {
    // Cache data without triggering re-render
    cacheRef.current.set(payload.id, payload);
    
    // Process and emit
    emit("data", processPayload(payload));
  });
}
```

## Styling

The workflow engine uses minimal default styles. You can customize the appearance:

```css
.graph-canvas {
  background: #f5f5f5;
  background-image: 
    linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.node-wrapper {
  /* Customize node container */
}

.node {
  /* Customize node content */
}
```

## Best Practices

1. **Event Naming**: Use descriptive event names (`data`, `error`, `complete`, etc.)
2. **Data Immutability**: Always create new objects when updating node data
3. **Cleanup**: The `useOn` hook automatically cleans up, but be mindful of refs and timers
4. **Type Safety**: Use TypeScript interfaces for node data
5. **Performance**: Use refs for data that doesn't need to trigger re-renders

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

