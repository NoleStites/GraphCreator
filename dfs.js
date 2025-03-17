var adjList;

var isPlaying = false;
document.getElementById("play_pause").addEventListener("click", function () {
    isPlaying = isPlaying ? false : true;

    // Change play/pause symbol
    let btn = document.getElementById("play_pause");
    if (isPlaying) {
        btn.style.backgroundImage = "url(\"/assets/pause.svg\")";
    } 
    else {
        btn.style.backgroundImage = "url(\"/assets/play.svg\")";
    }
});

// Entry point to the algorithm.
// Uses the graph's adjacency list to perform.
// Given the node ID for the start of the search, will prepare necessary vars
// before calling recursive function to perform search.
export async function DFS(start_node_id, adj_list) {
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
    [visited, path] = await visit(start_node_id, visited, path);
    console.log(path);
}

async function visit(node_id, visited, path) {
    document.getElementById(node_id).classList.add("visited");
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
            // await sleep(1000);
            await waitForCondition(() => isPlaying);
            [visited, path] = await visit(to_visit, visited, path);
    }

    return [visited, path];
}

let doContinue = false;
async function waitForCondition(conditionFunction, checkInterval = 1000) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (conditionFunction()) {
                clearInterval(interval);
                resolve();
            }
        }, checkInterval);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForClick(button_id) {
    return new Promise(resolve => {
        document.getElementById(button_id).addEventListener("click", resolve, { once: true });
    });
}