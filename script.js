
class AdjacencyList {
    constructor() {
        this.adj_lists = {}; // Maps node IDs to a list of node IDs they are connected to
    }

    // Adds an entry for the given node ID to the adjacency list
    // Returns 0 if successfully added and an error otherwise
    addNode(node_id) {
        // Check if node already exists
        if (node_id in this.adj_lists) {
            throw new Error(`Cannot add node \"${node_id}\" to AdjList. Already exists.`);
        }
        else {
            this.adj_lists[node_id] = [];
            return 0;
        }
    } // END addNode

    // Removes the entry for the given node ID (and all associated adjacencies) from the adjacency list. Updates other list entries accordingly
    // Returns 0 if successfully removed and an error otherwise
    removeNode(node_id) {
        // Check that node exists
        if (node_id in this.adj_lists) {
            delete this.adj_lists[node_id];

            // Remove any associated entries in other adj lists
            let keys = Object.keys(this.adj_lists);
            for (let i = 0; i < keys.length; i++) {
                try {
                    this.removeAdjacencyFromNode(keys[i], node_id);
                }
                catch(err) {continue;}
            }
            return 0;
        }
        else {
            throw new Error(`Cannot remove node \"${node_id}\" from AdjList. Does not exist.`);
        }
    } // END removeNode

    // Adds the given adjacent node ID to the given node ID's adjacency list
    // Returns 0 if successfully added and an error otherwise
    addAdjacencyToNode(node_id, adj_node_id) {
        if (!(node_id in this.adj_lists)) {
            throw new Error(`Cannot add adjacency to node \"${node_id}\" because it does not exist.`);
        }
        // Check if new entry already exists
        if (this.checkForAdjacency(node_id, adj_node_id)) {
            throw new Error(`Cannot add adjacency \"${adj_node_id}\" to node \"${node_id}\". Already exists.`);
        }
        else {
            this.adj_lists[node_id].push(adj_node_id);
            return 0;
        }
    } // END addAdjacencyToNode

    // Removes the given adjacent node ID from the given node ID's adjacency list
    // Returns 0 if successfully removed and an error otherwise
    removeAdjacencyFromNode(node_id, adj_node_id) {
        // Check if new entry already exists
        if (!this.checkForAdjacency(node_id, adj_node_id)) {
            throw new Error(`Cannot remove adjacency \"${adj_node_id}\" from node \"${node_id}\". Does not exist.`);
        }
        else {
            let index = this.adj_lists[node_id].indexOf(adj_node_id);
            this.adj_lists[node_id].splice(index, 1);
            return 0;
        }
    } // END removeAdjacencyFromNode

    // Checks if the given node is adjacent to the given comparison node ID
    // Returns true if adjacent, false if not, and an error otherwise
    checkForAdjacency(node_id, adj_node_id) {
        if (!(node_id in this.adj_lists)) {
            throw new Error(`Cannot check for adjacency to node \"${node_id}\". Node does not exist.`);
        } 
        else if (!(this.adj_lists[node_id].includes(adj_node_id))) {
            return false;
        }
        else {
            return true;
        }
    } // END checkForAdjacency

    // Returns an array of keys in the dictionary
    getKeys() {
        return Object.keys(this.adj_lists);
    } // END getKeys

    // Returns the list of adjacent nodes associated with the given node ID
    getAdjacencies(node_id) {
        return this.adj_lists[node_id];
    } // END getAdjacencies

    // Completely clears the adjacency list of all its contents
    clearList() {
        this.adj_lists = {};
        return 0;
    } // END clearList

    // Neatly prints the adjacency list contents to the console
    // Will prepend given message to line before adjacency list for debugging
    printAdjacencyLists(prepend="") {
        let keys = Object.keys(this.adj_lists);
        let output = "";
        if (prepend !== "") {output += prepend + '\n';}
        for (let i = 0; i < keys.length; i++) {
            output += `${keys[i]}: ${this.adj_lists[keys[i]].toString()}\n`;
        }
        console.log(output);
    } // END printAdjacencyLists
} // END AdjacencyList

class AdjacencyMatrixVisual {
    // Given a node ID, will add an entry in the adjacency matrix with all values set to 0
    addNode(node_id) {
        let node_label = document.getElementById(node_id).innerHTML;
        let matrix = document.getElementById("adj_matrix");

        // Create new label and data elements
        let new_label = document.createElement("th");
        new_label.classList.add(`label_for_${node_id}`);
        new_label.innerHTML = node_label;
        let new_data = document.createElement("td");
        new_data.classList.add("matrix_data_cell");
        new_data.innerHTML = 0;

        // Add new column (label and data) at the end of every row so far
        let rows = document.getElementsByClassName("matrix_row");
        for (let i = 0; i < rows.length; i++) {
            if (i === 0) { // Label row
                rows[i].appendChild(new_label.cloneNode("deep"));
            }
            else {
                let data_clone = new_data.cloneNode("deep");
                let row_node = rows[i].id.slice(4); // Remove the 'row_' in 'row_nodeX'
                data_clone.id = `data_${row_node}_${node_id}`;
                rows[i].appendChild(data_clone);
            }
        }

        // Create the new row for this node
        let new_row = document.createElement("tr");
        new_row.classList.add("matrix_row");
        new_row.id = `row_${node_id}`; // Ex: 'row_node0'
        new_row.appendChild(new_label.cloneNode("deep"));
        for (let i = 1; i < rows.length+1; i++) { // Default row values to 0
            let data_clone = new_data.cloneNode("deep");
            let row_node;
            if (i < rows.length) {
                row_node = rows[i].id.slice(4); // Remove the 'row_' in 'row_nodeX'
            } else {
                row_node = node_id; // The last column is an exception
            }
            data_clone.id = `data_${node_id}_${row_node}`;
            new_row.appendChild(data_clone);
        }
        matrix.appendChild(new_row);
    } // END addNode

    // Given a node ID, will remove an entry in the adjacency matrix
    removeNode(node_id) {
        let matrix = document.getElementById("adj_matrix");

        // Get row (and corresponding column) number of node to delete
        let column_num;
        let rows = document.getElementsByClassName("matrix_row");
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].id === `row_${node_id}`) {
                column_num = i;
                rows[i].remove(); // Delete row 
                break;
            }
        }

        // Delete corresponding column in remaining rows
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let column = row.children[column_num];
            column.remove();
        }
    } // END removeNode

    // Given the ID of node1 (start) and node2 (end), will edit the edge value from node1 -> node2 (order of given params matters)
    // Undirected graphs need to call this function twice, once with (node1, node2) and again with (node2, node1)
    updateEdgeValue(node1_id, node2_id, new_value) {
        let cell = document.getElementById(`data_${node1_id}_${node2_id}`);
        cell.innerHTML = `${new_value}`;
    } // END updateEdgeValue
} // END AdjacencyMatrixVisual

class AdjacencyMatrix {
    constructor() {
        this.nodes = []; // List of node IDs, in order, within the matrix
        this.adj_matrix = [];
        this.adjMatrixVisual = new AdjacencyMatrixVisual();
    }

    // Adds a new node with the given node ID to the matrix, initializing entries to 0
    // Returns 0 if successfully added and an error otherwise
    addNode(node_id) {
        if (this.nodes.includes(node_id)) {
            throw new Error(`Cannot add node ${node_id} to AdjMatrix. Already exists.`);
        }
        else {
            // Append new column to each already-existing matrix entry and build up new row
            let new_row = [0];
            for (let i = 0; i < this.adj_matrix.length; i++) {
                this.adj_matrix[i].push(0);
                new_row.push(0);
            }
            this.adj_matrix.push(new_row);
            this.nodes.push(node_id);
            this.adjMatrixVisual.addNode(node_id);
            return 0;
        }
    } // END addNode

    // Removes given node ID from matrix
    // Returns 0 if successfully removes and an error otherwise
    removeNode(node_id) {
        if (!this.nodes.includes(node_id)) {
            throw new Error(`Cannot remove node from AdjMatrix. Node ${node_id} does not exist.`);
        }
        else {
            let node_index = this.nodes.indexOf(node_id);
            this.nodes.splice(node_index, 1);
            this.adj_matrix.splice(node_index, 1);

            // Remove the corresponding column from every other row
            for (let i = 0; i < this.adj_matrix.length; i++) {
                this.adj_matrix[i].splice(node_index, 1);
            }

            this.adjMatrixVisual.removeNode(node_id);
            return 0;
        }
    } // END removeNode

    // Updates the matrix entry (edge value) at the intersection of the node1 ID and node2 ID
    // Returns 0 if successfully updated and an error otherwise
    updateEdgeValue(node1_id, node2_id, new_value) {
        if (!this.nodes.includes(node1_id)) {
            throw new Error(`Cannot update edge value in AdjMatrix. Node ${node1_id} does not exist.`);
        }
        else if (!this.nodes.includes(node2_id)) {
            throw new Error(`Cannot update edge value in AdjMatrix. Node ${node2_id} does not exist.`);
        }
        else {
            let node1_index = this.nodes.indexOf(node1_id);
            let node2_index = this.nodes.indexOf(node2_id);
            this.adj_matrix[node1_index][node2_index] = new_value;
            this.adjMatrixVisual.updateEdgeValue(node1_id, node2_id, new_value);
            return 0;
        }
    } // END updateEdgeValue

    // Completely clears the adjacency matrix and node list of all its contents (resets object)
    clearMatrix() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.adjMatrixVisual.removeNode(this.nodes[i]);
        }
        this.nodes = [];
        this.adj_matrix = [];
        return 0;
    } // END clearMatrix

    // Prints the adjacency matrix and node ID of each row to the console
    printAdjacencyMatrix(prepend="") {
        let output = ""
        if (prepend !== "") {output += prepend + '\n';}
        for (let i = 0; i < this.adj_matrix.length; i++) {
            output += `${this.nodes[i]} : ${this.adj_matrix[i].toString()}\n`;
        }
        console.log(output);
    } // END printAdjacencyMatrix
} // END AdjacencyMatrix

class Graph {
    constructor(graph_type) {
        this.adjList = new AdjacencyList();
        this.adjMatrix = new AdjacencyMatrix();
        this.node_ids = [];
        this.num_nodes = 0;
        this.graph_type = graph_type;
        this.hasWeightLabels = false; // Default (hides labels)
    }

    // Given an (x,y) position in the preview section, will add the node to all necessary places in the program
    addNode(posX, posY) {
        let node_id = `node${this.num_nodes+1}`;

        let placed_node = document.createElement("div");
        placed_node.classList.add("node");
        placed_node.id = node_id;
        placed_node.classList.add(`label_for_${placed_node.id}`);
        placed_node.innerHTML = this.getLetterLabel(this.num_nodes+1);
        // placed_node.innerHTML = num_nodes-1;
        
        // Enforce upper and lower bounds (keep node in box)
        let preview_box = document.getElementById("preview_section").getBoundingClientRect();
        let left = posX;
        let top = posY;
        if (left < node_size/2) {left = 0;}
        else if (left > (preview_box.width - node_size)) {left = preview_box.width - node_size;}
        if (top < node_size/2) {top = 0;}
        else if (top > (preview_box.height - node_size)) {top = preview_box.height - node_size;}

        placed_node.style.top = top + 'px';
        placed_node.style.left = left + 'px';
        placed_node.style.pointerEvents = "none";
        // placed_node.addEventListener("click", standardNodeSelect);
        document.getElementById("preview_section").appendChild(placed_node);
        dragElement(placed_node); // make node draggable

        this.adjList.addNode(node_id);
        this.adjMatrix.addNode(node_id);
        this.node_ids.push(node_id);
        this.num_nodes += 1;
    } // END addNode

    // Given a node ID, will remove the node from all necessary places in the program
    removeNode(node_id) {
        document.getElementById(node_id).remove(); // Remove the node element

        // Get IDs of all edge elements to remove
        let edge_IDs_to_remove = [];
        switch (this.graph_type) {
            case "undirected":
                // for (let i = 0; i < adj_lists[node_id].length; i++) {
                let adjacencies = this.adjList.getAdjacencies(node_id);
                for (let i = 0; i < adjacencies.length; i++) {
                    edge_IDs_to_remove.push(`edge_${this.createMinMaxNodeID(node_id, adjacencies[i])}`);
                }
                break;
            case "directed":
                edge_IDs_to_remove = getIncomingAndOutgoingEdges(node_id);
                break;
        }

        // Remove edges from DOM
        for (let i = 0; i < edge_IDs_to_remove.length; i++) {
            let edge_id = edge_IDs_to_remove[i];
            document.getElementById(edge_id).remove();
        }

        this.adjList.removeNode(node_id);
        this.adjMatrix.removeNode(node_id);

        let index_to_remove = this.node_ids.indexOf(node_id);
        this.node_ids.splice(index_to_remove, 1);
    } // END removeNode

    // Will completely clear the contents of the graph in all locations of the program
    clearGraph() {
        let ids_copy = [...this.node_ids]; // Strange copy syntax
        for (let i = 0; i < ids_copy.length; i++) {
            this.removeNode(ids_copy[i]);
        }
        this.num_nodes = 0;
    } // END clearGraph

    // Will change the graph type and reset the graph completely
    changeGraphType(new_type) {
        this.clearGraph();
        this.graph_type = new_type;
    } // END clearGraph

    // Will add an edge between the given node IDs (considers graph type)
    addEdge(node1_id, node2_id) {
        this.adjList.addAdjacencyToNode(node1_id, node2_id);
        this.adjMatrix.updateEdgeValue(node1_id, node2_id, 1);

        // Apply updates in both directions, not just one
        if (this.graph_type === "undirected") {
            this.adjList.addAdjacencyToNode(node2_id, node1_id);
            this.adjMatrix.updateEdgeValue(node2_id, node1_id, 1);
        }

        let node1 = document.getElementById(node1_id);
        let node2 = document.getElementById(node2_id);

        // Fetch node sizes
        let node1_props = node1.getBoundingClientRect();
        let node2_props = node2.getBoundingClientRect();

        // Node ID order to append to end of new element ID
        let node_order_id; // Either 'nodeX_nodeY' or 'nodeY_nodeX'
        switch (this.graph_type) {
            case "undirected": // Create id with smallest node listed first
                node_order_id = `${this.createMinMaxNodeID(node1.id, node2.id)}`;
                break;
            case "directed": // Enforce order of selected nodes in ID
                node_order_id = `${node1.id}_${node2.id}`;
                break;
        }

        // Create the new edge (div) element
        let preview_box = document.getElementById("preview_section");
        let new_edge = document.createElement("div");
        new_edge.classList.add("edge");
        new_edge.id = `edge_${node_order_id}`; // Ex: 'edge_node0_node1'

        // Create edge mask
        let edge_mask = document.createElement("div");
        edge_mask.classList.add("edge_mask");
        edge_mask.id = `edge_mask_${node_order_id}`;
        new_edge.appendChild(edge_mask);

        // Create weight label
        let weight = document.createElement("div");
        weight.classList.add("weight_label");
        weight.id = `weight_${node_order_id}`; // Ex: 'weight_node0_node1'
        weight.innerHTML = '1';
        weight.addEventListener("input", handleWeightLabelChange); // Called when label is editted
        if (this.hasWeightLabels) { weight.contentEditable = true; }
        new_edge.appendChild(weight);

        // Create arrow (directed graphs)
        if (graph_type === "directed") {
            let arrow = document.createElement("div");
            arrow.classList.add("arrow");
            arrow.id = `arrow_${node_order_id}`; // Ex: 'arrow_node0_node1'
            let translate_y = arrow_width/-2 + edge_thickness/2;
            arrow.style.top = translate_y + 'px';
            edge_mask.appendChild(arrow);
        }

        preview_box.appendChild(new_edge);
        
        // Size, translate, and rotate edge to fit between nodes
        if (graph_type === "directed" && this.adjList.checkForAdjacency(node2.id, node1.id)) {
            this.moveEdge(node1_id, node2_id);
            this.moveEdge(node2_id, node1_id);
        }
        else {
            this.moveEdge(node1_id, node2_id);
        }

        // Add the edge to the document and return its ID
        return new_edge.id;
    } // END addEdge

    // Will remove the edge between the given node IDs (considers graph type)
    removeEdge(node1_id, node2_id) {
        this.adjList.removeAdjacencyFromNode(node1_id, node2_id);
        this.adjMatrix.updateEdgeValue(node1_id, node2_id, 0);

        if (this.graph_type === "undirected") { // Remove other direction too
            this.adjList.removeAdjacencyFromNode(node2_id, node1_id);
            this.adjMatrix.updateEdgeValue(node2_id, node1_id, 0);
        }

        let edge = document.getElementById(`edge_${node1_id}_${node2_id}`);
        if (edge === null) {
            edge = document.getElementById(`edge_${node2_id}_${node1_id}`);
        }
        edge.remove();

        // There are two edges between nodes, so removing one should reposition the other to be center
        if (this.graph_type === "directed" && this.adjList.checkForAdjacency(node2_id, node1_id)) {
            this.moveEdge(node2_id, node1_id);
        }
    } // END removeEdge

    updateEdgeValue(node1_id, node2_id, new_value) {
        this.adjMatrix.updateEdgeValue(node1_id, node2_id, new_value);
    }

    // Will either display (true) or hide (false) the weights and labels
    toggleWeightsAndLabels(on_off) {
        this.hasWeightLabels = on_off;
        let weight_labels = document.getElementsByClassName("weight_label");
        let opacity_val = on_off ? "1" : "0";

        cssSetVars.style.setProperty("--weight-label-opacity", opacity_val);

        // Reset all label weights to 1 and make them uneditable 
        for (let i = 0; i < weight_labels.length; i++) {
            let label = weight_labels[i];
            label.innerHTML = "1"; // Reset label
            label.contentEditable = this.hasWeightLabels;
        }

        // Update adjacency matrix by removing/adding weights and setting all to '1'
        let data_cells = document.getElementsByClassName("matrix_data_cell");
        for (let i = 0; i < data_cells.length; i++) {
            let cell = data_cells[i];
            let value = Number(cell.innerHTML);
            if (value != 0) {
                cell.innerHTML = '1';
            }
        }
    }

    // === HELPER FUNCTIONS ===

    // Converts the given value into a string of letters.
    // Values above 26 start at 'AA', then 'AB', etc.
    // value 1 -> A, 2 -> B, ...
    // Can support up to 'ZZ', which is value=702 nodes
    getLetterLabel(value) {
        if (value > 702) {return `${value}`;}
        
        let alphaLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        value = value - 1;
        let label = "";
        
        let first_index = value % 26;
        label += alphaLabels[first_index];
        let second_index = Math.floor(value / 26) - 1;
        if (second_index > -1) {
            label = alphaLabels[second_index] + label;
        }

        return label;
    }

    // Will reposition the weight label between the given nodes to be centered
    moveWeightLabel(node1_id, node2_id) {
        // Node ID order to append to end of new element ID
        let node_order_id; // Either 'nodeX_nodeY' or 'nodeY_nodeX'
        switch (this.graph_type) {
            case "undirected": // Create id with smallest node listed first
                node_order_id = `${this.createMinMaxNodeID(node1_id, node2_id)}`;
                break;
            case "directed": // Enforce order of selected nodes in ID
                node_order_id = `${node1_id}_${node2_id}`;
                break;
        }

        let edge = document.getElementById(`edge_${node_order_id}`);
        let edge_length = edge.offsetWidth;
        let weight = document.getElementById(`weight_${node_order_id}`);
        let translate_x = edge_length/2 - weight.offsetWidth/2;
        let translate_y = weight.offsetHeight/-2 + edge_thickness/2;
        weight.style.left = translate_x + 'px';
        weight.style.top = translate_y + 'px';
        let tranform_props = edge.style.transform.split(' ');
        let angle = Number(tranform_props[0].slice(8, -4));
        weight.style.transform = `RotateZ(${-angle}rad)`;
    }

    // Will move the edge between the two given nodes (called when either node is repostioned)
    moveEdge(node1_id, node2_id) {
        let node1 = document.getElementById(node1_id);
        let node2 = document.getElementById(node2_id);

        // Node ID order to append to end of new element ID
        let node_order_id; // Either 'nodeX_nodeY' or 'nodeY_nodeX'
        switch (this.graph_type) {
            case "undirected": // Create id with smallest node listed first
                node_order_id = `${this.createMinMaxNodeID(node1.id, node2.id)}`;
                break;
            case "directed": // Enforce order of selected nodes in ID
                node_order_id = `${node1.id}_${node2.id}`;
                break;
        }

        // Get the edge element
        let edge = document.getElementById(`edge_${node_order_id}`);

        let node1_props = node1.getBoundingClientRect();
        let node2_props = node2.getBoundingClientRect();
        let edge_length = this.calculateDistance(node1_props.x, node1_props.y, node2_props.x, node2_props.y);
        edge.style.width = edge_length + 'px';
        edge.setAttribute('edgeLength', edge_length);

        // Calculate the center points of each given node within the preview area
        let node1_X = node1.offsetLeft + node_size/2;
        let node1_Y = node1.offsetTop + node_size/2;
        let node2_X = node2.offsetLeft + node_size/2;
        let node2_Y = node2.offsetTop + node_size/2;

        // Calculate the true center of the edge between the nodes
        let centerX = node1_X + (-1*(node1_X - node2_X)/2);
        let centerY = node1_Y + (-1*(node1_Y - node2_Y)/2);

        // Offset the edge (div) element to have its center centered on the line between the two nodes
        let centerX_offset = centerX - edge_length/2;
        let centerY_offset = centerY - edge_thickness/2;

        // Calculate angle to rotate edge div (currently a flat line)
        // cos(<ang>) = adjacent / hypotenuse
        let angle_factor = node2_Y < node1_Y ? -1 : 1; // Determines whether to rotate clockwise or counter-clockwise
        let adj = (node2_X - centerX);
        let hyp = edge_length/2;
        let angle = angle_factor * Math.acos(adj/hyp); // in radians

        // Translate and rotate the edge into position
        edge.style.top = centerY_offset + 'px';
        edge.style.left = centerX_offset + 'px';

        if (this.graph_type === "directed" && this.adjList.checkForAdjacency(node2.id, node1.id)) {
            edge.style.transform = `RotateZ(${angle}rad) TranslateY(${-1*double_edge_offset}px)`;        
        }
        else {
            edge.style.transform = `RotateZ(${angle}rad)`;
        }

        // Edge mask movement
        let edge_mask = document.getElementById(`edge_mask_${node_order_id}`);
        if (this.graph_type === "directed") {
            // The line below should only run if there will be a double edge; offset should be 0 for one edge
            let double_edge_offset_to_circle;
            // if (adj_lists[node2.id].includes(node1.id)) {
            if (this.adjList.checkForAdjacency(node2.id, node1.id)) {
                double_edge_offset_to_circle = node_size/2 - Math.sqrt((node_size/2)**2 - (double_edge_offset)**2);
            }
            else {
                double_edge_offset_to_circle = 0;            
            }
            let edge_mask_width = edge_length - node_size/2 - arrow_width - arrow_space_to_node + double_edge_offset_to_circle;
            edge_mask.style.width = edge_mask_width + 'px';
        } else {
            edge_mask.style.width = "100%";
        }

        // Reposition the weight labels
        this.moveWeightLabel(node1.id, node2.id);
    }

    // Given two node IDs (node0, node1, etc.), will a string of the format
    // 'nodeX_nodeY' such that X is the smaller node ID and Y is the larger
    createMinMaxNodeID(node_id1, node_id2) {
        let smallest_id = "node" + Math.min(Number(node_id1.slice(4)), Number(node_id2.slice(4)));
        let largest_id = "node" + Math.max(Number(node_id1.slice(4)), Number(node_id2.slice(4)));
        return `${smallest_id}_${largest_id}`;
    }

    // Returns the distance between two points
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    }
}

// Functionality of changing a weight label
function handleWeightLabelChange(event) {
    let label = event.target;
    let node_ids_str = label.id.slice(7); // Ex: 'weight_nodeX_nodeY' => 'nodeX_nodeY'
    let node_ids = node_ids_str.split('_');
    userGraph.moveWeightLabel(node_ids[0], node_ids[1]);
    userGraph.updateEdgeValue(node_ids[0], node_ids[1], label.innerHTML);
    if (graph_type === "undirected") {
        userGraph.updateEdgeValue(node_ids[1], node_ids[0], label.innerHTML);
    }
}

// Toggles the adjacency matrix visual on/off depending on checkbox value
function toggleAdjMatrix() {
    let adj_matrix = document.getElementById("adj_matrix_box");
    if (document.getElementById("adj_matrix_checkbox").checked) {
        adj_matrix.style.display = "block";
    }
    else {
        adj_matrix.style.display = "none";
    }
}

// Toggles the adjacency list visual on/off depending on checkbox value
function toggleAdjList() {
    let adj_list = document.getElementById("adj_list_box");
    if (document.getElementById("adj_list_checkbox").checked) {
        adj_list.style.display = "block";
    }
    else {
        adj_list.style.display = "none";
    }
}

// "Create button" event listener
document.getElementById("create_node_btn").addEventListener("click", function(event) {
    // For all nodes on the page, either allow or disallow pointer events
    function setNodePointerEvents(value) {
        let nodes = document.getElementsByClassName("node");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.pointerEvents = value;
        }
    }

    // Have node follow cursor for placing
    function mousemove(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        new_node.style.top = mouseY - node_size/2 + 'px';
        new_node.style.left = mouseX - node_size/2 + 'px';
    }

    // Disable create node action
    function resetCreateAction() {
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("mousemove", mousemove);
        document.getElementById("preview_section").removeEventListener("click", click);
        toggleButtonPanelMaskOff();
        setNodePointerEvents("all");
        new_node.remove();
    }

    // Make preview section clickable
    function click(event) {
        let top = event.layerY - node_size/2;
        let left = event.layerX - node_size/2;
        userGraph.addNode(left, top);
    }

    // Listen for cancel "ESC"
    function keydown(event) {
        if (event.key === "Escape") {
            resetCreateAction();
        }
    }

    toggleButtonPanelMaskOn("Click in preview section to place a node.<br>&quotESC&quot to cancel");

    // Create and add a new node cursor to the page
    let new_node = document.createElement("div");
    new_node.classList.add("node");
    document.getElementById("page").appendChild(new_node);

    // Set default node position to be on cursor
    let node_size = new_node.clientWidth;
    new_node.style.top = event.clientY - node_size/2 + 'px';
    new_node.style.left = event.clientX - node_size/2 + 'px';

    // Don't allow any nodes to be clickable at the moment
    setNodePointerEvents("none");

    // Apply event listeners
    document.addEventListener("mousemove", mousemove); // Listen for mouse movement
    document.getElementById("preview_section").addEventListener("click", click); // Listen for node placement
    document.addEventListener("keydown", keydown); // Listen for ESC
});

// Make the DIV element draggable
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let preview_box = document.getElementById("preview_section").getBoundingClientRect();
    let elmnt_props = elmnt.getBoundingClientRect();
    var edge_IDs_to_move;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        edge_IDs_to_move = getIncomingAndOutgoingEdges(e.target.id);

        document.getElementById(e.target.id).style.zIndex = node_zIndex+1; // Resolve issues with cursor detecting different node when on it
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        let new_top = elmnt.offsetTop - pos2;
        let new_left = elmnt.offsetLeft - pos1;

        // Do not let the node leave the preview area
        if (new_top < 0) {new_top = 0;}
        else if (new_top > preview_box.height - elmnt_props.width) {new_top = preview_box.height - elmnt_props.width;}
        if (new_left < 0) {new_left = 0;}
        else if (new_left > preview_box.width - elmnt_props.width) {new_left = preview_box.width - elmnt_props.width;}

        elmnt.style.top = new_top + "px";
        elmnt.style.left = new_left + "px";

        for (let i = 0; i < edge_IDs_to_move.length; i++) {
            let node_ids = edge_IDs_to_move[i].slice(5);
            let node1_node2 = node_ids.split('_');
            userGraph.moveEdge(node1_node2[0], node1_node2[1]);
        }
    }

    function closeDragElement(e) {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        document.getElementById(e.target.id).style.zIndex = node_zIndex;
    }
}

// Returns a list of edge element IDs that are either entering or leaving a given node
function getIncomingAndOutgoingEdges(node_id) {
    let edge_IDs = [];
    // 1. Outgoing edges from  node
    let outgoing_nodes = userGraph.adjList.getAdjacencies(node_id);
    for (let i = 0; i < outgoing_nodes.length; i++) {
        edge_IDs.push(`edge_${node_id}_${outgoing_nodes[i]}`);
    }
    // 2. Incoming edges to dragged node
    let all_node_ids = userGraph.adjList.getKeys();
    for (let i = 0; i < all_node_ids.length; i++) {
        let curr_node_adj_list = userGraph.adjList.getAdjacencies(all_node_ids[i]);
        if (curr_node_adj_list.includes(node_id)) { // Found incoming edge
            edge_IDs.push(`edge_${all_node_ids[i]}_${node_id}`);
        }
    }

    return edge_IDs;
}


document.getElementById("create_edge_btn").addEventListener("click", function(event) {
    // Resets the preview section to the default edge creation view (no nodes highlighted)
    function toggleOffStartNode(node_id) {
        start_node = null;
        let node = document.getElementById(node_id);
        if (node === null) {
            return;
        }
        node.classList.remove("create_edge_start");
        let end_nodes = userGraph.adjList.getAdjacencies(node_id);
        for (let i = 0; i < end_nodes.length; i++) {
            let curr_node = document.getElementById(end_nodes[i]);
            curr_node.classList.remove("create_edge_end");
        }
    }

    // Sets the given node as the start of all created edges and highlights endpoints (all nodes toggleable)
    function toggleOnStartNode(node_id) {
        start_node = node_id;
        let node = document.getElementById(node_id);
        node.classList.add("create_edge_start");
        let adjacencies = userGraph.adjList.getAdjacencies(node.id);
        for (let i = 0; i < adjacencies.length; i++) { // Iterate through all already-connected nodes
            let curr_node = document.getElementById(adjacencies[i]);
            curr_node.classList.add("create_edge_end");
        }
    }

    // What happens when a node is selected for new edge endpoint
    function selectableForEdge(event) {
        if (event.shiftKey) { // Selected new start point
            if  (start_node === null) { // No start mode currently selected
                toggleOnStartNode(event.target.id);
            }
            else if (event.target.id === start_node) { // Toggle off start node
                toggleOffStartNode(start_node);
            }
            else { // Change start node
                toggleOffStartNode(start_node);
                toggleOnStartNode(event.target.id);
            }
            return;
        }

        // BELOW: Left click with no shift (creates edges)
        if (start_node === null || event.target.id === start_node) { // Cannot create edge to self
            return; 
        }

        // Toggle clicked node ON or OFF (connected or not connected)
        let selected_node = event.target;
        if (selected_node.classList.contains("create_edge_end")) { // Remove edge
            selected_node.classList.remove("create_edge_end");
            userGraph.removeEdge(start_node, selected_node.id);
        }
        else { // Add edge
            selected_node.classList.add("create_edge_end");
            userGraph.addEdge(start_node, selected_node.id);
        }
    }

    // Listen for cancel "ESC"
    function keydown(event) {
        if (event.key === "Escape") {
            toggleOffStartNode(start_node);
            let nodes = document.getElementsByClassName("node");
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].removeEventListener("click", selectableForEdge);
                nodes[i].addEventListener("click", standardNodeSelect);
            }
            document.removeEventListener("keydown", keydown);
            toggleButtonPanelMaskOff();
        }
    }

    if (userGraph.num_nodes === 0) {return;}

    let start_node = null; // stores the ID of a node
    toggleButtonPanelMaskOn("&quotESC&quot to quit");

    let endpoint_node_ids = [];
    let latest_edge_preview = null;
    // Allow every node to be selected
    let nodes = document.getElementsByClassName("node");
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener("click", selectableForEdge);
        nodes[i].removeEventListener("click", standardNodeSelect);
    }
    document.addEventListener("keydown", keydown);
});

// Displays, in the side panel, info for the given node
// All elements with class 'label_for_nodeX' will be changed
function updateLabel(event) {
    // For all page elements with sharing a label, edit them
    let labels = document.getElementsByClassName(`label_for_${_selected_node}`);
    for (let i = 0; i < labels.length; i++) {
        labels[i].innerHTML = event.target.value;
    }
}

var _selected_node;
function toggleInfoPanelOn(node_id) {
    _selected_node = node_id;
    let node = document.getElementById(node_id);
    let info_panel = document.getElementById("node_info_section");
    info_panel.style.display = "block";

    let label_input = document.getElementById("label_input");
    label_input.value = node.innerHTML;
    label_input.addEventListener("input", updateLabel); // Every time something is typed
}

// Hides the info panel
function toggleInfoPanelOff() {
    document.getElementById("node_info_section").style.display = "none";
    document.getElementById("label_input").removeEventListener("input", updateLabel);
}

// What to do when a node is selected normally
function standardNodeSelect(event) {
    // toggleInfoPanelOff();
    // toggleInfoPanelOn(event.target.id);
    return;
}

// Functions for showing and hidding the side panel mask. When toggling on, provide message to display.
function toggleButtonPanelMaskOff() {
    document.getElementById("button_panel_mask").style.display = "none";
    document.getElementById("mask_text").innerHTML = "";
}
function toggleButtonPanelMaskOn(message) {
    document.getElementById("button_panel_mask").style.display = "flex";
    document.getElementById("mask_text").innerHTML = message;
}

// Defines the functionality of deleting when a node is clicked
function deleteOnClick(event) {
    userGraph.removeNode(event.target.id);
}

// The given class name will either be added (true) or removed (false) from every node
function applyClassOnNodes(class_name, doApply) {
    let nodes = document.getElementsByClassName("node");
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        doApply ? node.classList.add(class_name) : node.classList.remove(class_name);
    }
}

// The given function name will either be added (true) or removed (false) from every node as a click event
function applyClickEventOnNodes(func, doApply) {
    let nodes = document.getElementsByClassName("node");
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        doApply ? node.addEventListener("click", func) : node.removeEventListener("click", func);
    }
}

document.getElementById("delete_btn").addEventListener("click", function(event) {
    // Listen for cancel "ESC"
    function keydown(event) {
        if (event.key === "Escape") {
            toggleButtonPanelMaskOff();
            applyClassOnNodes("delete_node", false);
            applyClickEventOnNodes(standardNodeSelect, true);
            applyClickEventOnNodes(deleteOnClick, false);
        }
    }
    
    // Prep screen for delete mode
    toggleButtonPanelMaskOn("&quotESC&quot to quit");
    applyClassOnNodes("delete_node", true);
    // document.getElementById("node_info_section").style.display = "none";
    applyClickEventOnNodes(standardNodeSelect, false);
    applyClickEventOnNodes(deleteOnClick, true);

    
    document.addEventListener("keydown", keydown);
});

// Brings up a prompt box when changing graph type and applies logic to changing it
// will display given message as the question
function promptUserYesNo(new_graph_type, message) {
    document.getElementById("prompt_message").innerHTML = message;
    document.getElementById("prompt_section").style.display = "flex";

    function promptButtonClick(event) {
        if (event.target.innerHTML === "Yes") {
            // Reset the screen (delete all nodes, edges, and matrix entries)
            userGraph.changeGraphType(new_graph_type);     
            num_nodes = 0;
            // toggleInfoPanelOff();
            graph_type = new_graph_type; // "undirected", "directed", ...
            document.getElementById("graph_type_display").innerHTML = graph_type_display_names[graph_type];
            document.getElementById(`${graph_type}_radio`).checked = true;
        }
        else {
            document.getElementById(`${graph_type}_radio`).checked = true; // return radios to previous state
        }

        // Remove event listeners from buttons
        let buttons = document.getElementsByClassName("prompt_btn");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].removeEventListener("click", promptButtonClick);
        }

        document.getElementById("prompt_section").style.display = "none";
    }

    let buttons = document.getElementsByClassName("prompt_btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", promptButtonClick);
    }
}

// Import graph from file
var import_str;
function importGraph() {
    let fields = import_str.split('\n');
    graph_type = fields[0].slice(6, -2);
    hasWeightLabels = Boolean(fields[1].slice(8, -2));
    
    let rows = fields[2].split(';'); // 'A':0|0|1|1
    for (let i = 0; i < rows.length-1; i++) {
        let row_fields = rows[i].split(':');
        let label = row_fields[0].slice(1,-1); // A
        let values = row_fields[1].split('|'); // [0, 0, 1, 1]
    }
}

// Export graph as file
// Syntax:
/*
    type='undirected';\n
    weights=false;\n
    'A':0|0|1|1;'B':1|0|1|0; ...
*/
function exportGraph() {
    let export_str = "";

    // Append graph properties
    export_str += `type='${graph_type}';\n`;
    export_str += `weights=${hasWeightLabels};\n`;

    // Append graph vertex/edge data
    // let keys = Object.keys(adj_lists);
    let keys = adjList.getKeys();
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let node_label = document.getElementsByClassName(`label_for_${key}`)[0].innerHTML;

        // Fetch value from every cell in adjacency matrix row of current node
        let cell_values = [];
        for (let j = 0; j < keys.length; j++) {
            let data_cell = document.getElementById(`data_${key}_${keys[j]}`)
            cell_values.push(data_cell.innerHTML);
        }
        let cell_values_str = cell_values.join('|');

        // Append new node data to the export string
        export_str += `'${node_label}':${cell_values_str};`
    }
    console.log(export_str);
    import_str = export_str;
}

// Clears the graph in its entirety
function clearGraph() {
    userGraph.clearGraph();
}

function toggleWeights() {
    if (document.getElementById("weights_checkbox").checked) {
        userGraph.toggleWeightsAndLabels(true);
    }
    else {
        userGraph.toggleWeightsAndLabels(false);
    }
}





/* 
    ===== INITIALIZE VARIABLES FOR STARTUP =====
    ===== ALSO, APPLY EVENT LISTENERS TO MENU =====
*/

// Graph type menu functionality
document.getElementById(`undirected_radio`).checked = true; // default
function changeGraphType(event) {
    promptUserYesNo(event.target.value, "Changing graph types will delete your current graph. Are you sure that you want to continue?");
}
let graph_type_radios = document.getElementsByName("graph_type");
for (let i = 0; i < graph_type_radios.length; i++) {
    graph_type_radios[i].addEventListener("change", changeGraphType);
}

var graph_type = "undirected"; // Default
let graph_type_display_names = {
    "undirected": "Undirected",
    "directed": "Directed",
    "dfa": "DFA",
    "nfa": "NFA"
}
document.getElementById("graph_type_display").innerHTML = graph_type_display_names[graph_type];
document.getElementById(`${graph_type}_radio`).checked = true;

// Initialize a Graph object
var userGraph = new Graph(graph_type);

// Hamburger menu buttons
document.getElementById("import_btn").addEventListener("click", importGraph);
document.getElementById("export_btn").addEventListener("click", exportGraph);
document.getElementById("clear_btn").addEventListener("click", clearGraph);

// Graph features
document.getElementById("weights_checkbox").addEventListener("change", toggleWeights);
document.getElementById("adj_matrix_checkbox").addEventListener("change", toggleAdjMatrix);
document.getElementById("adj_list_checkbox").addEventListener("change", toggleAdjList);

document.getElementById("weights_checkbox").checked = false;
document.getElementById("adj_matrix_checkbox").checked = false;
document.getElementById("adj_list_checkbox").checked = false;


// Import necessary styles from stylesheet
const css_styles = getComputedStyle(document.documentElement); // Or any specific element
const cssSetVars = document.documentElement; // To use: cssSetVars.style.setProperty('--var-name', 'new_value')
var edge_thickness = Number(css_styles.getPropertyValue("--edge-thickness").slice(0,-2)); // px
var node_size = css_styles.getPropertyValue("--node-size").slice(0,-2); // Includes border
var node_zIndex = Number(css_styles.getPropertyValue("--node-z-index"));
var arrow_width = edge_thickness * Number(css_styles.getPropertyValue("--arrow-width-factor"));
var arrow_space_to_node = 0; // Number of pixels of spacing between arrow tip and node it points to
var double_edge_offset = 20; // px
