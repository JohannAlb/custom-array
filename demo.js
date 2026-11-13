// Demo script, moved out of myArray.js so importing the class has no side effects.

import { MyArrayClass } from "./myArray.js";

let array1 = new MyArrayClass(100);

console.log("capacity: " + array1.capacity);
console.log("length: " + array1.length());

for (let i = 0; i < 100; i++) {
  array1.push(i);
}

// array1.print();
array1.pop();
array1.popHead();
// array1.print();
array1.fastRandom(50, 200);
// array1.print();
array1.SortAsc();
array1.print();

console.log(array1.min());
console.log(array1.max());
console.log(array1.between(91, 94));

array1.cut(3, 95);
array1.print();

array1.reverse();
array1.print();

array1.performance();
