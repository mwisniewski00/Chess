abstract class Piece {
    column: string;
    row: number;
    color: string;
    isMoved: boolean = false;
    isWhite: boolean;
    type: string;

    constructor(isWhite: boolean, column: string, row: number) {
        if (isWhite) {
            this.color = "white";
        } else {
            this.color = "black";
        }

        this.isWhite = isWhite;
        this.column = column;
        this.row = row;
    }

    abstract canMove(column: string, row: number): boolean;

    move(colum: string, row: number): any {
        this.row = row;
        this.column = colum;
        this.isMoved = true;
    }
}

export default Piece;
