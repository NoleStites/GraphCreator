var adjList;
var isPlaying = false;
var doStep = false;
var checkInterval = 1000; // Play speed

// The following function will toggle the play button visuals and boolean variable for playing
function togglePlayButton() {
    isPlaying = isPlaying ? false : true;

    // Change play/pause symbol
    let btn = document.getElementById("play_pause");
    if (isPlaying) {
        btn.style.backgroundImage = "url(\"/assets/pause.svg\")";
    } 
    else {
        btn.style.backgroundImage = "url(\"/assets/play.svg\")";
        checkInterval = 1000;
    }
}

document.getElementById("play_pause").addEventListener("click", togglePlayButton);
document.getElementById("step_forward").addEventListener("click", function () {
    // When stepping forward, stop the play button if on and toggle doStep var
    if (isPlaying) {togglePlayButton();}
    checkInterval = 0;
    doStep = true;
});

async function waitForCondition(condFunction) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (condFunction()) {
                clearInterval(interval);
                resolve();
            }
        }, checkInterval);
    });
}

// The condition for continuing the playback/simulation of the algorithm
// Only continues when true is returned
function conditionFunction() {
    let result = isPlaying || doStep; // Continue playing if the play button is pressed or the desire to step exists

    // Reset step boolean if necessary
    doStep = false;

    return result;
}

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
            await waitForCondition(conditionFunction);
            [visited, path] = await visit(to_visit, visited, path);
    }

    return [visited, path];
}
