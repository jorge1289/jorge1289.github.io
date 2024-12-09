window.PacmanGame = function({ onError, gridSize = 20 }) {
  const canvasRef = window.React.useRef(null);
  const [gameState, setGameState] = window.React.useState({
    pacman: { x: 1, y: 1 },
    target: { x: 18, y: 18 },
    walls: [],
    exploredNodes: [],
    path: [],
    algorithm: 'bfs',
    isRunning: false,
    stepDelay: 100,
  });

  const CELL_SIZE = 20;
  const WALL_COLOR = '#0000FF';
  const PACMAN_COLOR = '#FFFF00';
  const EXPLORED_COLOR = 'rgba(255, 165, 0, 0.3)';
  const PATH_COLOR = '#00FF00';
  const TARGET_COLOR = '#FF0000';

  // Initialize maze
  window.React.useEffect(() => {
    const initializeMaze = () => {
      const walls = [];

      // Create outer walls
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          if (x === 0 || x === gridSize - 1 || y === 0 || y === gridSize - 1) {
            walls.push({ x, y });
          }
        }
      }

      // Add some inner walls (maze-like structure)
      for (let x = 5; x < gridSize - 5; x += 4) {
        for (let y = 5; y < gridSize - 5; y += 4) {
          if (Math.random() < 0.7) {
            walls.push({ x, y });
            if (Math.random() < 0.5) {
              walls.push({ x: x + 1, y });
            } else {
              walls.push({ x, y: y + 1 });
            }
          }
        }
      }

      setGameState(prev => ({
        ...prev,
        walls,
        exploredNodes: [],
        path: []
      }));
    };

    initializeMaze();
  }, [gridSize]);

  // Draw function
  const draw = window.React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw explored nodes
    ctx.fillStyle = EXPLORED_COLOR;
    gameState.exploredNodes.forEach(node => {
      ctx.fillRect(
        node.x * CELL_SIZE,
        node.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });

    // Draw path
    if (gameState.path.length > 0) {
      ctx.strokeStyle = PATH_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,
        gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2
      );
      gameState.path.forEach(point => {
        ctx.lineTo(
          point.x * CELL_SIZE + CELL_SIZE / 2,
          point.y * CELL_SIZE + CELL_SIZE / 2
        );
      });
      ctx.lineTo(
        gameState.target.x * CELL_SIZE + CELL_SIZE / 2,
        gameState.target.y * CELL_SIZE + CELL_SIZE / 2
      );
      ctx.stroke();
    }

    // Draw walls
    ctx.fillStyle = WALL_COLOR;
    gameState.walls.forEach(wall => {
      ctx.fillRect(
        wall.x * CELL_SIZE,
        wall.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });

    // Draw Pacman
    ctx.fillStyle = PACMAN_COLOR;
    ctx.beginPath();
    ctx.arc(
      gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0.2 * Math.PI,
      1.8 * Math.PI
    );
    ctx.lineTo(
      gameState.pacman.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.pacman.y * CELL_SIZE + CELL_SIZE / 2
    );
    ctx.closePath();
    ctx.fill();

    // Draw target
    ctx.fillStyle = TARGET_COLOR;
    ctx.beginPath();
    ctx.arc(
      gameState.target.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.target.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [gameState, gridSize]);

  // Game loop
  window.React.useEffect(() => {
    const gameLoop = setInterval(() => {
      draw();
    }, 1000 / 30); // 30 FPS

    return () => clearInterval(gameLoop);
  }, [draw]);

  // BFS implementation
  const bfs = async () => {
    const queue = [{ x: gameState.pacman.x, y: gameState.pacman.y, path: [] }];
    const visited = new Set();
    const walls = new Set(gameState.walls.map(w => `${w.x},${w.y}`));

    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      setGameState(prev => ({
        ...prev,
        exploredNodes: [...prev.exploredNodes, { x: current.x, y: current.y }]
      }));

      await new Promise(resolve => setTimeout(resolve, gameState.stepDelay));

      if (current.x === gameState.target.x && current.y === gameState.target.y) {
        setGameState(prev => ({
          ...prev,
          path: current.path,
          isRunning: false
        }));
        return;
      }

      const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }  // left
      ];

      for (const dir of directions) {
        const newX = current.x + dir.dx;
        const newY = current.y + dir.dy;
        const newKey = `${newX},${newY}`;

        if (!walls.has(newKey) && !visited.has(newKey) &&
            newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
          queue.push({
            x: newX,
            y: newY,
            path: [...current.path, { x: current.x, y: current.y }]
          });
        }
      }
    }
  };

  // DFS implementation
  const dfs = async () => {
    const stack = [{ x: gameState.pacman.x, y: gameState.pacman.y, path: [] }];
    const visited = new Set();
    const walls = new Set(gameState.walls.map(w => `${w.x},${w.y}`));

    while (stack.length > 0) {
      const current = stack.pop();
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      setGameState(prev => ({
        ...prev,
        exploredNodes: [...prev.exploredNodes, { x: current.x, y: current.y }]
      }));

      await new Promise(resolve => setTimeout(resolve, gameState.stepDelay));

      if (current.x === gameState.target.x && current.y === gameState.target.y) {
        setGameState(prev => ({
          ...prev,
          path: current.path,
          isRunning: false
        }));
        return;
      }

      const directions = [
        { dx: -1, dy: 0 },  // left
        { dx: 0, dy: 1 },   // down
        { dx: 1, dy: 0 },   // right
        { dx: 0, dy: -1 }   // up
      ];

      for (const dir of directions) {
        const newX = current.x + dir.dx;
        const newY = current.y + dir.dy;
        const newKey = `${newX},${newY}`;

        if (!walls.has(newKey) && !visited.has(newKey) &&
            newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
          stack.push({
            x: newX,
            y: newY,
            path: [...current.path, { x: current.x, y: current.y }]
          });
        }
      }
    }
  };

  // Manhattan distance heuristic for A*
  const heuristic = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  };

  // A* implementation
  const astar = async () => {
    const openSet = [{
      x: gameState.pacman.x,
      y: gameState.pacman.y,
      path: [],
      f: 0,
      g: 0
    }];
    const visited = new Set();
    const walls = new Set(gameState.walls.map(w => `${w.x},${w.y}`));

    while (openSet.length > 0) {
      // Find node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      setGameState(prev => ({
        ...prev,
        exploredNodes: [...prev.exploredNodes, { x: current.x, y: current.y }]
      }));

      await new Promise(resolve => setTimeout(resolve, gameState.stepDelay));

      if (current.x === gameState.target.x && current.y === gameState.target.y) {
        setGameState(prev => ({
          ...prev,
          path: current.path,
          isRunning: false
        }));
        return;
      }

      const directions = [
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
      ];

      for (const dir of directions) {
        const newX = current.x + dir.dx;
        const newY = current.y + dir.dy;
        const newKey = `${newX},${newY}`;

        if (!walls.has(newKey) && !visited.has(newKey) &&
            newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
          const g = current.g + 1;
          const h = heuristic(newX, newY, gameState.target.x, gameState.target.y);
          openSet.push({
            x: newX,
            y: newY,
            path: [...current.path, { x: current.x, y: current.y }],
            g: g,
            f: g + h
          });
        }
      }
    }
  };

  // Start search based on selected algorithm
  const startSearch = async () => {
    setGameState(prev => ({
      ...prev,
      isRunning: true,
      exploredNodes: [],
      path: []
    }));

    switch (gameState.algorithm) {
      case 'dfs':
        await dfs();
        break;
      case 'astar':
        await astar();
        break;
      default:
        await bfs();
    }
  };


  // Handle algorithm change
  const handleAlgorithmChange = (event) => {
    setGameState(prev => ({
      ...prev,
      algorithm: event.target.value,
      exploredNodes: [],
      path: []
    }));
  };

  return window.React.createElement('div', { className: 'flex flex-col items-center' },
    window.React.createElement('div', { className: 'mb-4 flex gap-4 items-center' },
      window.React.createElement('select', {
        value: gameState.algorithm,
        onChange: handleAlgorithmChange,
        disabled: gameState.isRunning,
        className: 'px-4 py-2 rounded border'
      },
        window.React.createElement('option', { value: 'bfs' }, 'Breadth-First Search'),
        window.React.createElement('option', { value: 'dfs' }, 'Depth-First Search'),
        window.React.createElement('option', { value: 'astar' }, 'A* Search')
      ),
      window.React.createElement('button', {
        onClick: startSearch,
        disabled: gameState.isRunning,
        className: 'px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300'
      }, gameState.isRunning ? 'Searching...' : 'Start Search')
    ),
    window.React.createElement('canvas', {
      ref: canvasRef,
      width: gridSize * CELL_SIZE,
      height: gridSize * CELL_SIZE,
      style: {
        backgroundColor: 'black',
        display: 'block'
      }
    })
  );
};