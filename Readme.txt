React Flow Clone: (I will be refering to the main component import as mainComponent for lack of a better term)
	- MainComponent: accepts the nodes, edges, nodeTypes, onNodesChange and onEdgeChange
		- nodes: an object that has the id, initialPosition and data
		 	 data will contain information about the node (like type(custom node), lable, etc)
		 	 custom nodes can be defined by writing a component, adding that component to the nodeTypes object and passing that to the mainComponent
		- edges: an object that accepts an id, a source and a desitnation
		- nodeTypes: object that maps custom nodes
	- Handles: Drag handles that can be poistioned in the left, right, top or bottom. 
		   can be from or to (from is top of the Node, to is bottom of the node)
		   they can also accept children, these children replace how the node is represented in the UI
	- Edge: SVG based path
		accepts source, target, id and data
		data will contain lable and anything else required
	- Connection Line: Can be dragged from handle to handle to connect things together
	
	- Communication between node:
		nodes can only communicate with each other if they are connected, and the way they communicate is the direction the graph moves


Architecture:
	- Graph Class: containes the nodes, edges
	- Node Class: contains details about the node
	- when dev does <Graph nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={...} onEdgesChange={...} /> we create a graph class internally and add nodes to it
