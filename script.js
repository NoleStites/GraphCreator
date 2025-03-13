
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
                this.removeAdjacencyFromNode(keys[i], node_id);
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
        this.nodes = [] // List of node IDs, in order, within the matrix
        this.adj_matrix = []
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
            return 0;
        }
    } // END updateEdgeValue

    // Completely clears the adjacency matrix and node list of all its contents (resets object)
    clearMatrix() {
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
    constructor() {
        this.adjList = new AdjacencyList();
        this.adjMatrix = new AdjacencyMatrix();
        this.adjMatrixVisual = new AdjacencyMatrixVisual();
        this.node_ids = [];
        this.num_nodes = 0;
    }

    // Given an (x,y) position in the preview section, will add the node to all necessary places in the program
    addNode(posX, posY) {
        let node_id = `node${this.num_nodes+1}`;
        this.num_nodes += 1;

        let placed_node = document.createElement("div");
        placed_node.classList.add("node");
        placed_node.id = node_id;
        placed_node.classList.add(`label_for_${placed_node.id}`);
        placed_node.innerHTML = this.getLetterLabel(this.num_nodes);
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
        this.adjMatrixVisual.addNode(node_id);
        this.node_ids.push(node_id);
    } // END addNode

    // Given a node ID, will remove the node from all necessary places in the program
    removeNode(node_id) {
        this.adjList.removeNode(node_id);
        this.adjMatrix.removeNode(node_id);
        this.adjMatrixVisual.removeNode(node_id);

        let index_to_remove = this.node_ids.indexOf(node_id);
        this.node_ids.splice(index_to_remove, 1);
    } // END removeNode

    // Will completely clear the contents of the graph in all locations of the program
    clearGraph() {
        for (let i = 0; i < this.node_ids.length; i++) {
            this.removeNode(this.node_ids[i]);
        }
    } // END clearGraph

    addEdge(node1_id, node2_id) {
        this.adjMatrix.updateEdgeValue(node1_id, node2_id, 1);
        this.adjMatrixVisual.updateEdgeValue(node1_id, node2_id, 1);
    }
    removeEdge(node1_id, node2_id) {
        this.adjMatrix.updateEdgeValue(node1_id, node2_id, 0);
        this.adjMatrixVisual.updateEdgeValue(node1_id, node2_id, 0);
    }
    updateEdgeValue(node1_id, node2_id, new_value) {
        this.adjMatrix.updateEdgeValue(node1_id, node2_id, new_value);
        this.adjMatrixVisual.updateEdgeValue(node1_id, node2_id, new_value);
    }

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
        // toggleSidePanelMaskOff();
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

    // toggleSidePanelMaskOn("Click in preview section to place a node.<br>&quotESC&quot to cancel");

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
            moveEdge(document.getElementById(node1_node2[0]), document.getElementById(node1_node2[1]));
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







// BEFORE: 867 lines
// var num_nodes = 0; // used for creating unique IDs for nodes
var adj_lists = {}; // Maps node IDs to a list of node IDs they are connected to
var graph_type = "undirected"; // Default
var hasWeightLabels = false; // Default

var userGraph = new Graph();
// var adjList = new AdjacencyList();
// var adjMatrixVisual = new AdjacencyMatrixVisual();

const css_styles = getComputedStyle(document.documentElement); // Or any specific element
const cssSetVars = document.documentElement; // To use: cssSetVars.style.setProperty('--var-name', 'new_value')
var edge_thickness = Number(css_styles.getPropertyValue("--edge-thickness").slice(0,-2)); // px
var node_size = css_styles.getPropertyValue("--node-size").slice(0,-2); // Includes border
var node_zIndex = Number(css_styles.getPropertyValue("--node-z-index"));
var arrow_width = edge_thickness * Number(css_styles.getPropertyValue("--arrow-width-factor"));
var arrow_space_to_node = 0; // Number of pixels of spacing between arrow tip and node it points to
var double_edge_offset = 20; // px