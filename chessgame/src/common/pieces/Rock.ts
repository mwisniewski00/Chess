import Piece from "./_Interface";
import tails from "../constant/tails";

class Rock extends Piece {
    type: string = "Rock";

    canMove(column: string, row: number): boolean {
        const ccn: number = tails[this.column];     //current column number
        const ncn: number = tails[column];          //new column number

        if(this.row == row && ccn != ncn){
            return true;
        } 
        if(this.row != row && ccn == ncn){
            return true;
        }

        return false;
    }
}

export default Rock;
