import Strike from "./Strike";
import Tile from "./Tile";

function Board({ tiles, onTileClick, playerTurn, strikeClass }) {
  // Function to get className based on row and col position
  const getTileClassName = (row, col) => {
    let className = "";
    // Add right border for first and second columns
    if (col < 2) {
      className += "right-border ";
    }
    // Add bottom border for first and second rows
    if (row < 2) {
      className += "bottom-border";
    }
    return className.trim();
  };

  // Create board using two loops
  const renderBoard = () => {
    const board = [];
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        board.push(
          <Tile
            key={index}
            playerTurn={playerTurn}
            onClick={() => onTileClick(index)}
            value={tiles[index]}
            className={getTileClassName(row, col)}
          />
        );
      }
    }
    
    return board;
  };

  return (
    <div className="board">
      {renderBoard()}
      <Strike strikeClass={strikeClass} />
    </div>
  );
}

export default Board;
