var adjList;

// Entry point to the algorithm.
// Uses the graph's adjacency list to perform.
// Given the node ID for the start of the search, will prepare necessary vars
// before calling recursive function to perform search.
export function DFS(start_node_id, adj_list) {
    adjList = adj_list;

    // Initialized visited dictionary to all false except for start node
    let node_ids = adjList.getKeys();
    let visited = {};
    for (let i = 0; i < node_ids.length; i++) {
        if (node_ids[i] === start_node_id) {
            visited[node_ids[i]] = true;
        }
        else {
            visited[node_ids[i]] = false;
        }
    }

    // Initialize search path array
    let path = [];

    // Begin algorithm by visiting the start node
    [visited, path] = visit(start_node_id, visited, path);
    console.log(path);
}

function visit(node_id, visited, path) {
    // document.getElementById(node_id).classList.add("visited");
    path.push(node_id);

    // Mark all adjacencies that have not yet been visited as visited and put in stack
    let stack = [];
    let adjs = adjList.getAdjacencies(node_id); 
    for (let i = 0; i < adjs.length; i++) {
        if (!visited[adjs[i]]) {
            stack.push(adjs[i]);
            visited[adjs[i]] = true;
        }
    }
    // Recursively visit each adj node in stack
    stack = stack.sort();
    for (let i = 0; i < stack.length; i++) {
        let to_visit = stack[i];
            [visited, path] = visit(to_visit, visited, path);
    }

    return [visited, path];
}