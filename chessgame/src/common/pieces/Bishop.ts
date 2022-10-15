import Piece from "./_Interface";
import tails from "../constant/tails";

class Bishop extends Piece {
    type: string = "Bishop";

    canMove(column: string, row: number): boolean {
        const ccn: number = tails[this.column];     //current column number
        const ncn: number = tails[column];          //new column number

        if(Math.max(ccn, ncn) - Math.min(ccn,ncn) == Math.max(this.row, row) - Math.min(this.row, row) && ccn != ncn){
            return true;
        } 

        return false;
    }
}

export default Bishop;
