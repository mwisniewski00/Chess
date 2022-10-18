import Piece from "./_Interface";
import tails from "../constant/tails";

class Knight extends Piece {
    type: string = "Bishop";

    canMove(column: string, row: number): boolean {
        const ccn: number = tails[this.column];     //current column number
        const ncn: number = tails[column];          //new column number

        if(Math.abs(ccn - ncn) ==  2 && Math.abs(this.row - row) == 1){
            return true;
        } 
        
        if(Math.abs(ccn - ncn) ==  1 && Math.abs(this.row - row) == 2){
            return true;
        }
        return false;
    }
}

export default Knight;
