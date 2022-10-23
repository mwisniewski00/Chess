import tails from "../constant/tails";

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

    public move(colum: string, row: number): any {
        this.row = row;
        this.column = colum;
        this.isMoved = true;
    }

    protected columnDifference(column: string): number {
        return Math.abs(tails[this.column] - tails[column])
    }

    protected rowDifference(row: number): number {
       return Math.abs(this.row - row)
    }
}

export default Piece;
