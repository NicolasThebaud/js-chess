import Piece from "./Piece.js";
import Constants from "./Constants.js";

const {Directions, Moves, Types} = Constants;
const ctx = document.getElementById("board").getContext("2d");
const sprite_source = document.querySelector("#sprite");
const selection = document.querySelector("#selection");

let mouseX, mouseY;
let selectedPiece;
let selectedCoords = [];
let resolution = 100;
let currentPossibleMoves = [];
let black_pieces = [];
let white_pieces = [];
let game = {};

(() => {
  // setup
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  document.addEventListener("mousedown", (event) => {
    const [x, y] = [
      Math.trunc(event.clientX / resolution),
      Math.trunc(event.clientY / resolution)
    ];

    if (selectedCoords.join("") === `${x}${y}`) { // cancel selection
      resetSelection();
    } else if (selectedPiece) {
      movePiece(...selectedCoords, x, y);
    } else {
      selectedCoords = [x, y];
      selectedPiece = game[`${x}-${y}`];
      /**/ selection.innerHTML = `selection: ${x},${y}, (type: ${selectedPiece ? selectedPiece.getId() : "N/A"})`;

      if (selectedPiece) {
        currentPossibleMoves = getMoveFromPiece(selectedPiece, x, y);
      } else {
        currentPossibleMoves = [];
      }
    }
  });

  // declare Pieces
  for (let n = 0; n < 8; n++) { // pawns
    game[`${n}-6`] = new Piece(`${Types.PAWN}_black_${n}`, n, 6, Moves.PAWN, 1, 5);
  }
  game[`3-7`] = new Piece(`${Types.KING}_black`, 3, 7, Moves.KING, 1, 0);
  game[`4-7`] = new Piece(`${Types.QUEEN}_black`, 4, 7, Moves.QUEEN, 1, 1);
  game[`2-7`] = new Piece(`${Types.BISHOP}_a_black`, 2, 7, Moves.BISHOP, 1, 2);
  game[`5-7`] = new Piece(`${Types.BISHOP}_b_black`, 5, 7, Moves.BISHOP, 1, 2);
  game[`1-7`] = new Piece(`${Types.KNIGHT}_a_black`, 1, 7, Moves.KNIGHT, 1, 3);
  game[`6-7`] = new Piece(`${Types.KNIGHT}_b_black`, 6, 7, Moves.KNIGHT, 1, 3);
  game[`0-7`] = new Piece(`${Types.ROOK}_a_black`, 0, 7, Moves.ROOK, 1, 4);
  game[`7-7`] = new Piece(`${Types.ROOK}_b_black`, 7, 7, Moves.ROOK, 1, 4);

  black_pieces.push(...Object.values(game));
})();

const board = [
  ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"],
  ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"],
  ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3"],
  ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4"],
  ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5"],
  ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6"],
  ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7"],
  ["A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8"]
];
const resetSelection = function () {
  selectedCoords = [];
  selectedPiece = null;
  currentPossibleMoves = [];
};

const getMoveFromPiece = function (piece, x, y) {
  const moves = piece.getMoves();
  const reachableCells = [];
  const pushIfUnoccupied = (coords) => {
    if (!game[`${coords[0]}-${coords[1]}`]) {
      reachableCells.push(coords);
    }
  }; 

  moves.map((move, i) => {
    let direction = i < 3 ? -1 : i > 5 ? 1 : 0;
    switch (move) {
      case Directions.PAWN_START:
        if (!piece.hasMoved) {
          pushIfUnoccupied([x, y-2]);
        }
        pushIfUnoccupied([x, y-1]);
        break;
      case Directions.KNIGHT:
        const xCells = [-2, -1, 1, 2, -2, -1, 1, 2];
        const yCells = [-1, -2, -2, -1, 1, 2, 2, 1];
        
        xCells.forEach((n, idx) => {
          pushIfUnoccupied([x + n, y + yCells[idx]]);
        });
        break;
      case Directions.ONE:
        pushIfUnoccupied([x + (i % 3) - 1, y + direction]);
        break;
      case Directions.LONG:
        let offsetX = i % 3 - 1;
        reachableCells.push(...__spread(x, y, offsetX, direction, offsetX, direction));
        break;
      default: break;
    }
  });

  // console.warn(reachableCells);
  return reachableCells.filter(cell => cell[0] >= 0 && cell[0] < 8 && cell[1] >= 0 && cell[1] < 8 );
};
const __spread = function (pieceX, pieceY, x, y, incrementX, incrementY, cells = []) {
  const xInBounds = pieceX + x >= 0 && pieceX + x < 8;
  const yInBounds = pieceY + y >= 0 && pieceY + y < 8;
  const cellUnoccupied = !game[`${pieceX + x}-${pieceY + y}`];
  
  if (xInBounds && yInBounds && cellUnoccupied) {
    cells.push([pieceX + x, pieceY + y]);
    return __spread(pieceX, pieceY, x + incrementX, y + incrementY, incrementX, incrementY, cells);
  } else {
    return cells;
  }
};

const movePiece = function (pieceX, pieceY, newX, newY) {
  const isMoveAllowed = currentPossibleMoves.some(cell => cell.join("") === `${newX}${newY}`);

  if (newX < 0 || newX > 7 || newY < 0 || newY > 7 || !isMoveAllowed) {
    resetSelection();
    return;
  }

  const piece = game[`${pieceX}-${pieceY}`];

  console.warn("move piece", piece.getId(), "from", pieceX, "-", pieceY, "to", newX, "-", newY);

  piece.updatePrevious(pieceX, pieceY);
  game[`${newX}-${newY}`] = piece;
  delete game[`${pieceX}-${pieceY}`];

  // reset
  resetSelection();
};

const drawBoard = function () {
  const colors = ["#ECB176", "#FED8B1"];
    
  for (let row in board) {
    for (let col in board[row]) {
      const offsetx = col * resolution;
      const offsety = row * resolution;
      
      ctx.fillStyle = row % 2 ? colors[col % 2] : colors[1 - col % 2];
      ctx.fillRect(offsety, offsetx, resolution, resolution);
      ctx.fillStyle = "#00000066";
      ctx.font = "20px serif";
      ctx.fillText(`${board[row][col]} ~ ${row}-${col}`, offsety + 10, offsetx + resolution - 10);
    }
  }
};

const drawPieces = function () {
  Object.entries(game).forEach(([coords, piece]) => {
    const spriteCoords = piece.getSpriteCoord();

    ctx.drawImage(
      sprite_source,
      spriteCoords[1] * 45, spriteCoords[0] * 45, 45, 45,
      coords.charAt(0) * resolution, coords.charAt(2) * resolution, 45, 45
    );
  });
};

function animate() {
  ctx.clearRect(0, 0, 1000, 1000);

  drawBoard();
  drawPieces();

  const [x, y] = [
    Math.trunc(mouseX / resolution),
    Math.trunc(mouseY / resolution)
  ];

  if (x < 8 && y < 8) { // hover
    ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
  }
  currentPossibleMoves.forEach((cell) => {
    ctx.fillStyle = "#11AA1166";
    ctx.fillRect(cell[0] * resolution, cell[1] * resolution, resolution, resolution);
  });
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#FF111166";
  ctx.strokeRect(selectedCoords[0] * resolution, selectedCoords[1] * resolution, resolution, resolution);

  setTimeout(() => requestAnimationFrame(animate), 8);
};

animate();
