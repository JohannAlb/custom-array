// Tests for MyArrayClass. No DOM access here, so this runs in a browser
// (via index.html) and in Node alike.

import { MyArrayClass } from "../myArray.js";

const tests = [];

function test(name, body) {
  tests.push({ name, body });
}

function assertEqual(actual, expected) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error("expected " + expectedText + " but got " + actualText);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeArray(values, capacity = 100) {
  const array = new MyArrayClass(capacity);
  for (const value of values) {
    array.push(value);
  }
  return array;
}

// The live elements, read straight from storage so a bug in at() cannot
// hide a bug in the method under test.
function contents(myArray) {
  const values = [];
  for (let i = 0; i < myArray.length(); i++) {
    values.push(myArray.array[i]);
  }
  return values;
}

function sortedCopy(values) {
  return [...values].sort((a, b) => a - b);
}

function randomValues(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 1000));
}

// ---------- construction, push, length ----------

test("new array is empty with default capacity 100", () => {
  const array = new MyArrayClass();
  assertEqual(array.length(), 0);
  assertEqual(array.capacity, 100);
});

test("push appends items in order", () => {
  assertEqual(contents(makeArray([5, 6, 7])), [5, 6, 7]);
});

test("deviation: push on a full array is ignored", () => {
  const array = makeArray([1, 2], 2);
  array.push(3);
  assertEqual(contents(array), [1, 2]);
});

// ---------- removing ----------

test("pop removes the last item", () => {
  const array = makeArray([1, 2, 3]);
  array.pop();
  assertEqual(contents(array), [1, 2]);
});

test("deviation: pop on an empty array leaves length at 0", () => {
  const array = new MyArrayClass();
  array.pop();
  assertEqual(array.length(), 0);
});

test("popHead removes the first item", () => {
  const array = makeArray([1, 2, 3]);
  array.popHead();
  assertEqual(contents(array), [2, 3]);
});

test("deviation: popHead on an empty array leaves length at 0", () => {
  const array = new MyArrayClass();
  array.popHead();
  assertEqual(array.length(), 0);
});

test("clear empties the array", () => {
  const array = makeArray([1, 2, 3]);
  array.clear();
  assertEqual(array.length(), 0);
});

test("cut removes a range at the end", () => {
  const array = makeArray([0, 1, 2, 3, 4]);
  array.cut(3, 4);
  assertEqual(contents(array), [0, 1, 2]);
});

test("cut removes a range in the middle and keeps the whole tail", () => {
  const array = makeArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  array.cut(2, 3);
  assertEqual(contents(array), [0, 1, 4, 5, 6, 7, 8, 9]);
});

// ---------- reading ----------

test("at returns the item at an index", () => {
  assertEqual(makeArray([4, 5, 6]).at(1), 5);
});

test("deviation: at outside the array returns undefined", () => {
  const array = makeArray([4, 5, 6]);
  array.pop();
  assertEqual(array.at(2), undefined);
  assertEqual(array.at(-1), undefined);
});

test("between returns the inclusive range as a new array", () => {
  const array = makeArray([0, 1, 2, 3, 4]);
  const range = array.between(1, 3);
  assertTrue(range instanceof MyArrayClass, "between should return a MyArrayClass");
  assertEqual(contents(range), [1, 2, 3]);
  assertEqual(contents(array), [0, 1, 2, 3, 4]);
});

test("min, max, sum and mean", () => {
  const array = makeArray([4, -2, 9, 1]);
  assertEqual(array.min(), -2);
  assertEqual(array.max(), 9);
  assertEqual(array.sum(), 12);
  assertEqual(array.mean(), 3);
});

test("min and max with a single item", () => {
  const array = makeArray([7]);
  assertEqual(array.min(), 7);
  assertEqual(array.max(), 7);
});

test("deviation: min and max on an empty array return undefined", () => {
  const array = new MyArrayClass();
  assertEqual(array.min(), undefined);
  assertEqual(array.max(), undefined);
});

test("min, max and sum ignore popped items", () => {
  const array = makeArray([5, 1, 100]);
  array.pop();
  assertEqual(array.min(), 1);
  assertEqual(array.max(), 5);
  assertEqual(array.sum(), 6);
});

// ---------- writing ----------

test("fill overwrites every item and keeps the length", () => {
  const array = makeArray([1, 2, 3]);
  array.fill(8);
  assertEqual(contents(array), [8, 8, 8]);
});

test("fastRandom fills every item with an integer inside the range", () => {
  const array = makeArray(new Array(50).fill(-1));
  array.fastRandom(10, 12);
  assertEqual(array.length(), 50);
  for (const value of contents(array)) {
    assertTrue(
      Number.isInteger(value) && value >= 10 && value <= 12,
      "value outside 10..12: " + value,
    );
  }
});

test("deviation: fastRandom with min >= max leaves the array unchanged", () => {
  const array = makeArray([1, 2, 3]);
  array.fastRandom(9, 3);
  assertEqual(contents(array), [1, 2, 3]);
});

test("reverse reverses the order", () => {
  const array = makeArray([1, 2, 3, 4]);
  array.reverse();
  assertEqual(contents(array), [4, 3, 2, 1]);
});

// ---------- sorting (same tests for all three algorithms) ----------

for (const sortName of ["SortAsc", "mergeSort", "insertionSort"]) {
  test(sortName + " sorts random values ascending", () => {
    const values = randomValues(100);
    const array = makeArray(values);
    array[sortName]();
    assertEqual(contents(array), sortedCopy(values));
  });

  test(sortName + " handles duplicates and already sorted input", () => {
    const array = makeArray([3, 1, 3, 2, 2, 1]);
    array[sortName]();
    assertEqual(contents(array), [1, 1, 2, 2, 3, 3]);
    array[sortName]();
    assertEqual(contents(array), [1, 1, 2, 2, 3, 3]);
  });

  test("deviation: " + sortName + " handles empty and single-item arrays", () => {
    const empty = new MyArrayClass();
    empty[sortName]();
    assertEqual(empty.length(), 0);

    const single = makeArray([42]);
    single[sortName]();
    assertEqual(contents(single), [42]);
  });

  test("deviation: " + sortName + " ignores popped items", () => {
    const array = makeArray([50, 40, 30, 1]);
    array.pop();
    array[sortName]();
    assertEqual(contents(array), [30, 40, 50]);
  });
}

// SortAsc is left out of the negative-number test on purpose: it never
// terminates on such input, which would freeze the page instead of failing.
for (const sortName of ["mergeSort", "insertionSort"]) {
  test(sortName + " sorts negative numbers", () => {
    const array = makeArray([-1, -5, 3, 0, -2]);
    array[sortName]();
    assertEqual(contents(array), [-5, -2, -1, 0, 3]);
  });
}

// ---------- performance ----------

test("performance reports a time for each sort and leaves the array sorted", () => {
  const array = makeArray(randomValues(100));
  const results = array.performance(5);

  for (const sortName of ["SortAsc", "mergeSort", "insertionSort"]) {
    assertTrue(sortName in results, "missing result for " + sortName);
    for (const time of Object.values(results[sortName])) {
      assertTrue(typeof time === "number" && time >= 0, "bad time for " + sortName);
    }
  }

  assertEqual(array.length(), 100);
  assertEqual(contents(array), sortedCopy(contents(array)));
});

test("deviation: performance with fewer than 1 round does nothing", () => {
  const array = makeArray([3, 1, 2]);
  assertEqual(array.performance(0), undefined);
  assertEqual(contents(array), [3, 1, 2]);
});

// Runs every test and returns [{ name, passed, error }].
// The class logs on every push, so console output is muted while testing.
export function runTests() {
  const originalLog = console.log;
  const originalTable = console.table;
  console.log = () => {};
  console.table = () => {};

  try {
    return tests.map(({ name, body }) => {
      try {
        body();
        return { name, passed: true, error: null };
      } catch (error) {
        return { name, passed: false, error: error.message };
      }
    });
  } finally {
    console.log = originalLog;
    console.table = originalTable;
  }
}
