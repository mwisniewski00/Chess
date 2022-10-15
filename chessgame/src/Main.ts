import Bishop from "./common/pieces/Bishop";

const f1 = new Bishop(true, "f", 1);

console.log(f1.canMove("h", 3)); //true
console.log(f1.canMove("g", 2)); //true
console.log(f1.canMove("a", 6)); //true
console.log(f1.canMove("a", 1)); //false
console.log(f1.canMove("f", 6)); //false
console.log(f1.canMove("c", 6)); //false


