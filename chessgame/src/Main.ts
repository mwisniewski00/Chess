import Bishop from "./common/pieces/Bishop";
import King from "./common/pieces/King";
import Knight from "./common/pieces/Knight"
import Pawn from "./common/pieces/Pawn"
import Queen from "./common/pieces/Queen";
import Rook from "./common/pieces/Rook";

console.log("Bishop");
const f1 = new Bishop(true, "f", 1);

console.log(f1.canMove("h", 3)); //true
console.log(f1.canMove("g", 2)); //true
console.log(f1.canMove("a", 6)); //true
console.log(f1.canMove("a", 1)); //false
console.log(f1.canMove("f", 6)); //false
console.log(f1.canMove("c", 6)); //false

console.log("King");
const e1 = new King(true, "e", 1)

console.log(e1.canMove("f", 1)); //true
console.log(e1.canMove("e", 2)); //true
console.log(e1.canMove("d", 2)); //true
console.log(e1.canMove("e", 6)); //false
console.log(e1.canMove("d", 7)); //false
console.log(e1.canMove("c", 1)); //false

console.log("Knight");
const b1 = new Knight(true, "b", 1)

console.log(b1.canMove("c", 3)); //true
console.log(b1.canMove("a", 3)); //true
console.log(b1.canMove("d", 2)); //true
console.log(b1.canMove("e", 6)); //false
console.log(b1.canMove("d", 7)); //false
console.log(b1.canMove("b", 2)); //false


console.log("Pawn");
const a2 = new Pawn(true, "a", 2)

console.log(a2.canMove("a", 3)); //true
console.log(a2.canMove("a", 4)); //true
console.log(a2.canMove("a", 5)); //false
console.log(a2.canMove("a", 1)); //false
console.log(a2.canMove("b", 2)); //false
console.log(a2.canMove("d", 7)); //false

console.log("Queen");
const d1 = new Queen(true, "d", 1)

console.log(d1.canMove("d", 7)); //true
console.log(d1.canMove("a", 4)); //true
console.log(d1.canMove("a", 1)); //false
console.log(d1.canMove("c", 3)); //false
console.log(d1.canMove("g", 5)); //false
console.log(d1.canMove("c", 8)); //false

console.log("Rook");
const a1 = new Rook(true, "a", 1)

console.log(a1.canMove("a", 3)); //true
console.log(a1.canMove("a", 4)); //true
console.log(a1.canMove("g", 1)); //true
console.log(a1.canMove("b", 2)); //false
console.log(a1.canMove("g", 2)); //false
console.log(a1.canMove("d", 7)); //false