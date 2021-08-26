import { useCallback, useState } from "react";
import GameField from "./GameField";

const GameWrapper = () => {
  const [gameState, setGameState] = useState("pending");
  const [playerColor, setPlayerColor] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const startGameHandler = (e) => {
    setPlayerColor(e.target.id);
    setGameState("started");
  };

  const finishGame = useCallback((result) => {
    setGameState("finished");
    setGameResult(result);
  }, []);

  const restartGameHandler = () => setGameState("pending");

  let content = (
    <div className="game-wrapper__start-field">
      <h2> Pick a Color to Start The Game</h2>
      <div className="game-wrapper__start-controls">
        <button id="red" onClick={startGameHandler} />
        <button id="yellow" onClick={startGameHandler} />
      </div>
    </div>
  );

  if (gameState === "started") {
    content = (
      <GameField
        playerColor={playerColor}
        stop={restartGameHandler}
        finish={finishGame}
      />
    );
  }

  if (gameState === "finished") {
    content = (
      <div className="game-wrapper_results-field">
        <h2>Game is Completed </h2>
        <h3>
          {gameResult === "draw"
            ? "You have a draw! Let's try again"
            : gameResult === "player"
            ? "Сongratulations, you won!"
            : "Unfortunately, you lost. Let's try again "}
        </h3>
        <button className="btn" onClick={restartGameHandler}>
          Restart
        </button>
      </div>
    );
  }

  return <section className="game-wrapper">{content}</section>;
};
export default GameWrapper;
