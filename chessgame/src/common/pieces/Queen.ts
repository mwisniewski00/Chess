import Piece from "./_Interface";

class Queen extends Piece {
    type: string = "Queen";

    canMove(column: string, row: number): boolean {        //new column number

        if(this.row == row && this.column != column){
            return true;
        } 
        if(this.row != row && this.column == column){
            return true;
        }
        if(this.columnDifference(column) == this.rowDifference(row) && this.column != column){
            return true;
        } 

        return false;
    }
}

export default Queen;
