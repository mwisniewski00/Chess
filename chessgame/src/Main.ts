import Bishop from "./common/pieces/Bishop";
import King from "./common/pieces/King";
import Knight from "./common/pieces/Knight"

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