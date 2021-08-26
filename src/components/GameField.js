import { useCallback, useEffect, useState } from "react";

const allSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const winnigCombinations = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
  [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7],
];

const checkWinnigCombination = (squaresComb) => {
  let isWinnig = false;
  for (const combination of winnigCombinations) {
    if (
      squaresComb.includes(combination[0]) &&
      squaresComb.includes(combination[1]) &&
      squaresComb.includes(combination[2])
    ) {
      isWinnig = true;
      break;
    }
  }
  return isWinnig;
};

const GameField = (props) => {
  const { playerColor, stop, finish } = props;
  const [playerMoves, setPlayerMoves] = useState([]);
  const [botMoves, setBotMoves] = useState([]);
  const [isPlayerMove, setIsPlayerMove] = useState(true);
  const [winState, setWinState] = useState(null);
  const isPlayerWinnig = checkWinnigCombination(playerMoves);
  const isBotWinning = checkWinnigCombination(botMoves);
  const usedSquares = playerMoves.concat(botMoves);
  const botColor = playerColor === "red" ? "yellow" : "red";
  const currentColor = isPlayerMove ? playerColor : botColor;

  const playerMove = (id) => {
    setPlayerMoves((curState) => {
      const updatedState = [...curState];
      updatedState.push(id);
      return updatedState;
    });
  };
  const botMove = (id) => {
    setBotMoves((curState) => {
      const updatedState = [...curState];
      updatedState.push(id);
      return updatedState;
    });
  };

  const stopGameHandler = () => stop();

  const clickSquareHandler = useCallback(
    (id) => {
      if (winState) {
        return;
      }
      const curentSquare = document.getElementById("square" + id);
      if (
        curentSquare.className.includes("red") ||
        curentSquare.className.includes("yellow")
      ) {
        alert("You need to pick an empty square to make move");
        return;
      }
      curentSquare.classList.add(`square-item__${currentColor}`);
      if (isPlayerMove) {
        playerMove(id);
        setIsPlayerMove(false);
      } else {
        botMove(id);
        setIsPlayerMove(true);
      }
    },
    [isPlayerMove, winState, currentColor]
  );

  useEffect(() => {
    if (isPlayerMove) {
      return;
    }
    if (isPlayerWinnig) {
      setWinState("player");
      return;
    }
    if (isBotWinning) {
      setWinState("bot");
      return;
    }
    if (usedSquares.length === 9) {
      setWinState("draw");
      return;
    }

    let timer;
    const emptySquares = [...allSquares];
    usedSquares.forEach((usedSq) => {
      const index = emptySquares.indexOf(usedSq);
      index >= 0 && emptySquares.splice(index, 1);
    });
    const random = Math.floor(Math.random() * emptySquares.length);
    timer = setTimeout(() => clickSquareHandler(emptySquares[random]), [500]);

    return () => clearTimeout(timer);
  }, [
    isPlayerMove,
    usedSquares,
    clickSquareHandler,
    isPlayerWinnig,
    isBotWinning,
  ]);

  useEffect(() => {
    let timer;
    if (winState) {
      timer = setTimeout(() => finish(winState), [500]);
    }
    return () => clearTimeout(timer);
  }, [winState, finish]);

  const squares = [];
  for (let i = 1; i <= allSquares.length; i++) {
    squares.push(
      <li
        key={i}
        id={"square" + i}
        className="square-item"
        onClick={clickSquareHandler.bind(null, i)}
      />
    );
  }

  return (
    <div className="game-wrapper__game-field">
      <ul>{squares}</ul>
      <button className="btn" onClick={stopGameHandler}>
        Stop Game
      </button>
    </div>
  );
};
export default GameField;
