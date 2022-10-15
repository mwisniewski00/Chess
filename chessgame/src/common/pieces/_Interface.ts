interface Piece {
    column: string;
    row: number;
    color: string;
    isMoved: boolean;
    isWhite: boolean;
    type: string;

    canMove(colum: string, row: number);
    move(colum: string, row: number);
};

export default Piece;