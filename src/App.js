import { useRef, useState, useCallback } from "react";
import produce from "immer";

import "./styles.css";

const grid = 40;

const cellsAround = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

export default function App() {
  const genGrid = () => {
    const rows = [];
    for (let i = 0; i < grid; i++) {
      rows.push(Array.from(Array(grid), () => 0));
    }
    return rows;
  };

  const [board, setBoard] = useState(() => genGrid());
  const [gol, setGol] = useState(false);
  const runningRef = useRef(gol);
  runningRef.current = gol;

  const genRandom = () => {
    const rows = [];
    for (let i = 0; i < grid; i++) {
      rows.push(Array.from(Array(grid), () => (Math.random() > 0.5 ? 1 : 0)));
    }
    return rows;
  };

  const runGol = useCallback(() => {
    if (!runningRef.current) return;

    setBoard((board) =>
      produce(board, (draft) => {
        for (let i = 0; i < grid; i++) {
          for (let j = 0; j < grid; j++) {
            let neighbors = 0;
            cellsAround.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newJ >= 0 && newI < grid && newJ < grid) {
                neighbors += board[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              draft[i][j] = 0;
            } else if (board[i][j] === 0 && neighbors === 3) {
              draft[i][j] = 1;
            }
          }
        }
      })
    );
    setTimeout(runGol, 100);
  }, []);

  const startSimulation = () => {
    setGol(!gol);
    if (!gol) {
      runningRef.current = true;
      runGol();
    }
  };

  const empty = () => setBoard(genGrid());
  const rand = () => setBoard(genRandom());

  return (
    <div className="App">
      <div className="buttons">
        <button
          onClick={startSimulation}
          style={{ backgroundColor: gol ? "#DC2626" : "#059669" }}
        >
          {gol ? "Stop" : "Start"} simulation
        </button>
        <button onClick={empty}>Clear</button>
        <button onClick={rand}>Randomize</button>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${grid}, 20px)` }}
      >
        {board.map((rows, i) =>
          rows.map((col, j) => (
            <div
              className="table"
              onClick={() => {
                const newBoard = produce(board, (draft) => {
                  draft[i][j] = board[i][j] ? 0 : 1;
                });
                setBoard(newBoard);
              }}
              key={`${i}-${j}`}
              style={{
                width: 15,
                height: 15,
                background: board[i][j] ? "#EC4899" : undefined
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}
