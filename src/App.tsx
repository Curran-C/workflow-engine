import { useState, useCallback } from "react";
import { Graph } from "./core/Graph";
import Node from "./components/Node/Node";
import EdgesLayer from "./components/Edge/EdgeLayer";
import NodeEditorModal from "./deleteLater/NodeEditorModal";

// Import all node types
import WebhookTrigger from "./deleteLater/WebhookTrigger";
import APIDataSource from "./deleteLater/APIDataSource";
import RandomDataSource from "./deleteLater/RandomDataSource";
import JSONTransform from "./deleteLater/JSONTransform";
import MergeNode from "./deleteLater/MergeNode";
import ConditionalBranch from "./deleteLater/ConditionalBranch";
import LoopIterator from "./deleteLater/LoopIterator";
import Accumulator from "./deleteLater/Accumulator";
import ErrorHandler from "./deleteLater/ErrorHandler";
import SuccessOutput from "./deleteLater/SuccessOutput";
import FailureOutput from "./deleteLater/FailureOutput";
import StatsCounter from "./deleteLater/StatsCounter";
import Dashboard from "./deleteLater/Dashboard";
import DelayNode from "./deleteLater/DelayNode";

// Node type mapping
const nodeTypes = {
  webhook: WebhookTrigger,
  api: APIDataSource,
  random: RandomDataSource,
  transform: JSONTransform,
  merge: MergeNode,
  condition: ConditionalBranch,
  loop: LoopIterator,
  accumulator: Accumulator,
  errorHandler: ErrorHandler,
  success: SuccessOutput,
  failure: FailureOutput,
  stats: StatsCounter,
  dashboard: Dashboard,
  delay: DelayNode,
};

// Layout constants
const COL1 = 20;      // Trigger
const COL2 = 200;     // Data sources
const COL3 = 420;     // Transform & Merge
const COL4 = 640;     // Conditional
const COL5 = 860;     // Branching paths
const COL6 = 1080;    // Iteration & Error handling
const COL7 = 1300;    // Outputs
const COL8 = 1520;    // Stats & Dashboard

const ROW1 = 20;
const ROW2 = 180;
const ROW3 = 340;
const ROW4 = 500;

// Define 15 nodes for the n8n-style workflow
const initialNodes = [
  // 1. Trigger (Column 1)
  {
    id: "trigger",
    initialPosition: { x: COL1, y: ROW2 },
    type: "webhook",
    data: { label: "Webhook Trigger" },
  },
  
  // 2-3. Data Sources (Column 2)
  {
    id: "apiSource",
    initialPosition: { x: COL2, y: ROW1 },
    type: "api",
    data: { label: "API Source" },
  },
  {
    id: "randomSource",
    initialPosition: { x: COL2, y: ROW3 },
    type: "random",
    data: { label: "Random Gen", count: 4, min: 10, max: 50 },
  },
  
  // 4-5. Transform Layer (Column 3)
  {
    id: "transform",
    initialPosition: { x: COL3, y: ROW1 },
    type: "transform",
    data: { label: "Calculate Totals", operation: "calculateTotal" },
  },
  {
    id: "merge",
    initialPosition: { x: COL3, y: ROW2 },
    type: "merge",
    data: { label: "Merge Data", expectedSources: 2 },
  },
  
  // 6. Conditional Branch (Column 4)
  {
    id: "condition",
    initialPosition: { x: COL4, y: ROW2 },
    type: "condition",
    data: { label: "Check Total", threshold: 500, field: "total" },
  },
  
  // 7-8. Branching Paths (Column 5)
  {
    id: "delay",
    initialPosition: { x: COL5, y: ROW1 },
    type: "delay",
    data: { label: "Process Delay", delay: 200 },
  },
  {
    id: "errorHandler",
    initialPosition: { x: COL5, y: ROW3 },
    type: "errorHandler",
    data: { label: "Error Handler", strategy: "fallback" },
  },
  
  // 9-10. Iteration (Column 6)
  {
    id: "iterator",
    initialPosition: { x: COL6, y: ROW1 },
    type: "loop",
    data: { label: "Loop Items", field: "items", delay: 100 },
  },
  {
    id: "accumulator",
    initialPosition: { x: COL6, y: ROW2 },
    type: "accumulator",
    data: { label: "Collect Results" },
  },
  
  // 11-12. Output Nodes (Column 7)
  {
    id: "successOutput",
    initialPosition: { x: COL7, y: ROW1 },
    type: "success",
    data: { label: "Success" },
  },
  {
    id: "failureOutput",
    initialPosition: { x: COL7, y: ROW3 },
    type: "failure",
    data: { label: "Failures" },
  },
  
  // 13. Stats Counter (Column 7, middle)
  {
    id: "statsCounter",
    initialPosition: { x: COL7, y: ROW2 },
    type: "stats",
    data: { label: "Statistics" },
  },
  
  // 14. Dashboard (Column 8)
  {
    id: "dashboard",
    initialPosition: { x: COL8, y: ROW2 },
    type: "dashboard",
    data: { label: "Dashboard" },
  },
];

// Define edges connecting the workflow
const initialEdges = [
  // Trigger to data sources
  { id: "e1", source: "trigger", target: "apiSource" },
  { id: "e2", source: "trigger", target: "randomSource" },
  
  // API source to transform
  { id: "e3", source: "apiSource", target: "transform" },
  
  // Transform and Random to Merge
  { id: "e4", source: "transform", target: "merge" },
  { id: "e5", source: "randomSource", target: "merge" },
  
  // Merge to Condition
  { id: "e6", source: "merge", target: "condition" },
  
  // Condition branches
  { id: "e7", source: "condition", target: "delay" },        // high branch
  { id: "e8", source: "condition", target: "errorHandler" }, // low branch
  
  // High path: delay -> iterator -> accumulator -> success
  { id: "e9", source: "delay", target: "iterator" },
  { id: "e10", source: "iterator", target: "accumulator" },
  { id: "e11", source: "accumulator", target: "successOutput" },
  
  // Error handler to failure output
  { id: "e12", source: "errorHandler", target: "failureOutput" },
  
  // Success and failure to stats
  { id: "e13", source: "successOutput", target: "statsCounter" },
  { id: "e14", source: "failureOutput", target: "statsCounter" },
  
  // Stats to dashboard
  { id: "e15", source: "statsCounter", target: "dashboard" },
];

const graph = new Graph(initialNodes, initialEdges);

// Store node configs for editing (maps node id to its initial config)
const nodeConfigMap = new Map(
  initialNodes.map((n) => [n.id, { id: n.id, type: n.type, data: n.data }])
);

export default function App() {
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string; data: Record<string, any> } | null>(null);
  const [version, setVersion] = useState(0);

  // Handle double-click on nodes using event delegation
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    // Find the closest node-wrapper element
    const target = e.target as HTMLElement;
    const nodeWrapper = target.closest("[data-node-id]") as HTMLElement;
    
    if (nodeWrapper) {
      const nodeId = nodeWrapper.getAttribute("data-node-id");
      if (nodeId) {
        const nodeConfig = nodeConfigMap.get(nodeId);
        if (nodeConfig) {
          // Get current data from the actual node
          const node = graph.getNodes().find((n) => n.getId() === nodeId);
          if (node) {
            setSelectedNode({
              id: nodeId,
              type: nodeConfig.type,
              data: { ...nodeConfig.data, ...node.getData() },
            });
          }
        }
      }
    }
  }, []);

  // Handle saving node changes
  const handleSaveNode = useCallback((nodeId: string, newData: Record<string, any>) => {
    const node = graph.getNodes().find((n) => n.getId() === nodeId);
    if (node) {
      // Update the node's data
      node.setData(newData);
      
      // Update our config map
      const config = nodeConfigMap.get(nodeId);
      if (config) {
        config.data = { ...config.data, ...newData };
      }
      
      // Force re-render by bumping version
      setVersion((n) => n + 1);
    }
  }, []);

  return (
    <div 
      className="graph-canvas" 
      style={{ 
        position: "relative", 
        width: "100%", 
        minHeight: "100vh",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Title */}
      <div style={{
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "8px 16px",
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}>
        n8n-Style Workflow Demo • 15 Nodes • Double-click to edit
      </div>
      
      {/* Render all nodes */}
      {graph.getNodes().map((node) => {
        const hasSource = graph.getOutgoingEdges(node).length > 0;
        const hasTarget = graph.getIncomingEdges(node).length > 0;

        return (
          <Node 
            key={`${node.getId()}-${version}`} 
            node={node} 
            source={hasSource} 
            target={hasTarget} 
            types={nodeTypes} 
          />
        );
      })}

      {/* Render edges */}
      <EdgesLayer graph={graph} />

      {/* Node Editor Modal */}
      <NodeEditorModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onSave={handleSaveNode}
      />
    </div>
  );
}
