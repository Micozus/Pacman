var astar = {
  init: function(grid) {
      for(var x = , xl = grid.length; x < xl; x++) {
          for(var y = , yl = grid[x].length; y < yl; y++) {
              var node = grid[x][y];
              node.f = ;
              node.g = ;
              node.h = ;
              node.cost = 1;
              node.visited = false;
              node.closed = false;
              node.parent = null;
          }
      }
  },
  heap: function() {
      return new BinaryHeap(function(node) {
          return node.f;
      });
  },
  search: function(grid, start, end, diagonal, heuristic) {
      astar.init(grid);
      heuristic = heuristic || astar.manhattan;
      diagonal = !!diagonal;

      var openHeap = astar.heap();

      openHeap.push(start);

      while(openHeap.size() > ) {

          // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
          var currentNode = openHeap.pop();

          // End case -- result has been found, return the traced path.
          if(currentNode === end) {
              var curr = currentNode;
              var ret = [];
              while(curr.parent) {
                  ret.push(curr);
                  curr = curr.parent;
              }
              return ret.reverse();
          }

          // Normal case -- move currentNode from open to closed, process each of its neighbors.
          currentNode.closed = true;

          // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
          var neighbors = astar.neighbors(grid, currentNode, diagonal);

          for(var i=, il = neighbors.length; i < il; i++) {
              var neighbor = neighbors[i];

              if(neighbor.closed || neighbor.isWall()) {
                  // Not a valid node to process, skip to next neighbor.
                  continue;
              }

              // The g score is the shortest distance from start to current node.
              // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
              var gScore = currentNode.g + neighbor.cost;
              var beenVisited = neighbor.visited;

              if(!beenVisited || gScore < neighbor.g) {

                  // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                  neighbor.visited = true;
                  neighbor.parent = currentNode;
                  neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                  neighbor.g = gScore;
                  neighbor.f = neighbor.g + neighbor.h;

                  if (!beenVisited) {
                      // Pushing to heap will put it in proper place based on the 'f' value.
                      openHeap.push(neighbor);
                  }
                  else {
                      // Already seen the node, but since it has been rescored we need to reorder it in the heap
                      openHeap.rescoreElement(neighbor);
                  }
              }
          }
      }

      // No result was found - empty array signifies failure to find path.
      return [];
  },
  manhattan: function(pos0, pos1) {
      // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

      var d1 = Math.abs (pos1.x - pos0.x);
      var d2 = Math.abs (pos1.y - pos0.y);
      return d1 + d2;
  },
  neighbors: function(grid, node, diagonals) {
      var ret = [];
      var x = node.x;
      var y = node.y;

      // West
      if(grid[x-1] && grid[x-1][y]) {
          ret.push(grid[x-1][y]);
      }

      // East
      if(grid[x+1] && grid[x+1][y]) {
          ret.push(grid[x+1][y]);
      }

      // South
      if(grid[x] && grid[x][y-1]) {
          ret.push(grid[x][y-1]);
      }

      // North
      if(grid[x] && grid[x][y+1]) {
          ret.push(grid[x][y+1]);
      }

      if (diagonals) {

          // Southwest
          if(grid[x-1] && grid[x-1][y-1]) {
              ret.push(grid[x-1][y-1]);
          }

          // Southeast
          if(grid[x+1] && grid[x+1][y-1]) {
              ret.push(grid[x+1][y-1]);
          }

          // Northwest
          if(grid[x-1] && grid[x-1][y+1]) {
              ret.push(grid[x-1][y+1]);
          }

          // Northeast
          if(grid[x+1] && grid[x+1][y+1]) {
              ret.push(grid[x+1][y+1]);
          }

      }

      return ret;
  }
};
Conclusion
This A* search implementation could be used as a component to larger system (like a game - maybe tower defense or puzzle), or just for learning purposes. I have done my best to make the code understandable and to present the concepts in a way that would help someone who has never seen the algorithm before, or someone who is not very familiar with JavaScript.

Feel free to view the demo, or download the latest version of the astar.js file to mess around with it. Check out the javascript-astar project page on Github for the latest code and documentation.

Comments
Brian Says:
May 20th, 2013 at 5:42 am
Sam,
If you use the `diagonal` option it can move similarly to Euclidean Free. Basically, pass true as the 4th parameter to astar.search. By default it uses the Manhattan heuristic, but if you’d rather use Euclidean, you could write your own callback and pass it in as the 5th parameter.

Sam Says:
May 20th, 2013 at 9:32 am
hey :) the basic code worked like “EuclideanFree”, so I extended the ifs for “Euclidean” like in the exsample post before
im not 100% for mistakes but the test looks good ^^

all you have to do now is to say “Euclidean” oder “EuclidianFree” at the 4th parameter

if (diagonals == “Euclidean”) { //new mode

// Southwest