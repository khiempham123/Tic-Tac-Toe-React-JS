import { useState, useEffect } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  //Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  //Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (
      tileValue1 !== null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      setStrikeClass(strikeClass);
      if (tileValue1 === PLAYER_X) {
        setGameState(GameState.playerXWins);
      } else {
        setGameState(GameState.playerOWins);
      }
      return;
    }
  }

  const areAllTilesFilledIn = tiles.every((tile) => tile !== null);
  if (areAllTilesFilledIn) {
    setGameState(GameState.draw);
  }
}

function TicTacToe() {
  const [history, setHistory] = useState([
    { tiles: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inProgress);

  const currentHistory = history[currentMove];
  const tiles = currentHistory.tiles;
  const playerTurn = currentMove % 2 === 0 ? PLAYER_X : PLAYER_O;

  const handleTileClick = (index) => {
    if (gameState !== GameState.inProgress) {
      return;
    }

    if (tiles[index] !== null) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    
    // Calculate row and col for the move
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    
    // Update history - remove any future history if we're not at the latest move
    const newHistory = history.slice(0, currentMove + 1);
    newHistory.push({ tiles: newTiles, location: { row, col, index } });
    
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setHistory([{ tiles: Array(9).fill(null), location: null }]);
    setCurrentMove(0);
    setStrikeClass(null);
  };

  const jumpTo = (move) => {
    setCurrentMove(move);
    setStrikeClass(null);
    setGameState(GameState.inProgress);
  };

  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickSound.play();
    }
  }, [tiles]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();
    }
  }, [gameState]);

  // Generate moves list
  const moves = history.map((step, move) => {
    let description;
    if (move === 0) {
      description = "Go to game start";
    } else {
      const player = move % 2 === 0 ? PLAYER_O : PLAYER_X;
      const location = step.location;
      description = `Go to move #${move} - ${player} (${location.row}, ${location.col})`;
    }

    // If this is the current move, show text instead of button
    if (move === currentMove) {
      return (
        <li key={move}>
          <strong>You are at move #{move}</strong>
          {move > 0 && ` - ${move % 2 === 0 ? PLAYER_O : PLAYER_X} (${step.location.row}, ${step.location.col})`}
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Sort moves based on isAscending
  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board
        playerTurn={playerTurn}
        tiles={tiles}
        onTileClick={handleTileClick}
        strikeClass={strikeClass}
      />
      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
      
      <div className="game-info">
        <div>
          <button onClick={toggleSort} className="sort-button">
            Sort: {isAscending ? "Ascending ↑" : "Descending ↓"}
          </button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

export default TicTacToe;
