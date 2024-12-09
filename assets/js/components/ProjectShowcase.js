// Define ProjectShowcase globally
window.PacmanProjectShowcase = function() {
  const [isSimulationRunning, setIsSimulationRunning] = window.React.useState(false);
  const [error, setError] = window.React.useState(null);

  const handleError = (error) => {
    console.error('Simulation error:', error);
    setError(error.message);
    setIsSimulationRunning(false);
  };

  return window.React.createElement('div', { className: "w-full max-w-4xl p-4 border rounded-lg" },
    window.React.createElement('div', { className: "mb-4" },
      window.React.createElement('h4', { className: "text-xl font-bold mb-2" }, "Pac-Man AI Search Visualization"),
      window.React.createElement('p', { className: "text-gray-600" }, 
        "Watch as different search algorithms (BFS, DFS, A*) help Pacman find optimal paths through the maze."
      )
    ),
    window.React.createElement('div', { className: "space-y-4" },
      window.React.createElement('div', { className: "flex gap-4" },
        window.React.createElement('button', {
          onClick: () => {
            setIsSimulationRunning(true);
            setError(null);
            console.log('Simulation started');
          },
          disabled: isSimulationRunning,
          className: "px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
        }, isSimulationRunning ? 'Simulation Running' : 'Start AI Simulation'),
        isSimulationRunning && window.React.createElement('button', {
          onClick: () => window.location.reload(),
          className: "px-4 py-2 rounded border hover:bg-gray-100"
        }, "Reset Simulation")
      )
    ),
    isSimulationRunning && window.React.createElement(window.PacmanGame, {
      onError: handleError,
      gridSize: 20
    }),
    error && window.React.createElement('div', { className: "mt-4 text-red-500" },
      `Error: ${error}`
    ),
    !error && window.React.createElement('div', { className: "mt-4 text-sm text-gray-500" },
      isSimulationRunning ? 
        "AI pathfinding simulation is running..." : 
        "Click the button above to start the pathfinding simulation"
    )
  );
};