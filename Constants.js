const Directions = {
    PAWN_START: "~",
    ONE: "1",
    LONG: "+",
    KNIGHT: "K",
    NULL: "_"
}

const Moves = { // clockwise
    PAWN: ["~"], // 2 on first move, then 1 forward
    ROOK: ["_", "+", "_", "+", "_", "+", "_", "+", "_"],
    KNIGHT: ["K"],
    BISHOP: ["+", "_", "+", "_", "_", "_", "+", "_", "+"],
    KING: ["1", "1", "1", "1", "_", "1", "1", "1", "1"],
    QUEEN: ["+", "+", "+", "+", "_", "+", "+", "+", "+"]
};

const Types = {
    PAWN: "PAWN",
    ROOK: "ROOK",
    KNIGHT: "KNIGHT",
    BISHOP: "BISHOP",
    KING: "KING",
    QUEEN: "QUEEN"
};

export default {Directions, Moves, Types};