import Piece from "./_Interface";
import tails from "../constant/tails";

class King extends Piece {
    type: string = "King";

    canMove(column: string, row: number): boolean {
        const ccn: number = tails[this.column];     //current column number
        const ncn: number = tails[column];          //new column number

        if(Math.abs(ccn - ncn) == 1 && row == this.row ){
            return true;
        } 

        if(Math.abs(this.row - row) == 1 && ccn == ncn){
            return true;
        }

        if (Math.abs(ccn - ncn) == Math.abs(this.row - row) && Math.abs(ccn - ncn) == 1){
            return true
        }
        return false;
    }
}

export default King;
