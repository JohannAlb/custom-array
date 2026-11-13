// this file contains a klass for a custom array

export class MyArrayClass {
  constructor(capacity = 100) {
    //defaults capacity to 10
    this.size = 0;
    if (Number.isInteger(capacity) && capacity > 0) {
      this.capacity = capacity;
    } else {
      this.capacity = 100;
    }
    this.array = new Array();
  }

  print() {
    console.log("\n=== Printing Array ===");
    for (let i = 0; i < this.size; i++) {
      console.log("item " + i + ": " + this.array[i]);
    }
    console.log("=== End of Array ===\n");
  }

  length() {
    return this.size;
  }

  push(item) {
    if (this.size >= this.capacity && Number.isInteger(item)) {
      console.log("Array is full!");
      return;
    }
    this.array[this.size++] = item;
    console.log("pushed: " + item);
  }

  clear() {
    this.size = 0;
    console.log("Array Cleared");
  }

  pop() {
    if (this.size > 0) {
      this.size--;
    }
  }

  popHead() {
    if (this.size > 0) {
      this.size--;
      for (let i = 0; i < this.size; i++) {
        this.array[i] = this.array[i + 1];
      }
    }
  }

  min() {
    if (this.size > 1) {
      let curMin = this.array[0];
      for (let i = 1; i < this.size; i++) {
        if (this.array[i] < curMin) {
          curMin = this.array[i];
        }
      }
      return curMin;
    } else if (this.size == 1) {
      return this.array[0];
    } else {
      console.log("Array Empty");
    }
  }

  max() {
    if (this.size > 1) {
      let curMax = this.array[0];
      for (let i = 1; i < this.size; i++) {
        if (this.array[i] > curMax) {
          curMax = this.array[i];
        }
      }
      return curMax;
    } else if (this.size == 1) {
      return this.array[0];
    } else {
      console.log("Array Empty");
    }
  }

  sum() {
    let sum = 0;
    for (let i = 0; i < this.size; i++) {
      sum += this.array[i];
    }
    return sum;
  }

  mean() {
    if (this.size > 0) {
      return this.sum() / this.size;
    } else {
      console.log("Array Empty");
    }
  }

  at(index) {
    if (index >= 0 && index < this.size) {
      return this.array[index];
    }
  }

  fill(item) {
    for (let i = 0; i < this.size; i++) {
      this.array[i] = item;
    }
  }

  fastRandom(min, max) {
    if (min < max && Number.isInteger(min) && Number.isInteger(max)) {
      for (let i = 0; i < this.size; i++) {
        this.array[i] = Math.floor(Math.random() * (max + 1 - min)) + min;
      }
    } else if (min == max) {
      this.fill(min);
    } else {
      console.log("invalid input");
    }
  }

  // CRiss cross apple sauce cocktail shacker shaking bubbles into sorted .
  SortAsc() {
    let done = false;
    while (!done) {
      for (let i = 1; i < this.size; i++) {
        if (this.array[i] < this.array[i - 1]) {
          const cur = this.array[i];
          this.array[i] = this.array[i - 1];
          this.array[i - 1] = cur;
        }
      }
      for (let i = this.size - 2; i >= 0; i--) {
        if (this.array[i] > this.array[i + 1]) {
          const cur = this.array[i];
          this.array[i] = this.array[i + 1];
          this.array[i + 1] = cur;
        }
      }
      let valid = true;
      let last = this.array[0];
      for (let i = 1; i < this.size; i++) {
        if (this.array[i] < last) {
          valid = false;
        }
        last = this.array[i];
      }
      if (valid) {
        done = true;
      }
    }
  }

  between(from, to) {
    if (from <= to && to < this.size && from >= 0) {
      let returnArray = new MyArrayClass(to - from + 1);
      for (let i = from; i <= to; i++) {
        returnArray.push(this.array[i]);
      }

      return returnArray;
    }
  }

  cut(from, to) {
    if (from <= to && to < this.size && from >= 0) {
      for (let i = from; i < this.size; i++) {
        this.array[i] = this.array[i + to - from + 1];
      }

      this.size -= to - from + 1;
    }
  }

  reverse() {
    let tempArray = new MyArrayClass(this.size);

    for (let i = this.size - 1; i >= 0; i--) {
      tempArray.push(this.array[i]);
    }

    this.array = tempArray.array;
  }

  mergeSort() {
    // Bottom-up merge sort: merge sorted runs of width 1, 2, 4, ... until
    // a single run covers the whole array.
    let source = this.array;
    let target = new MyArrayClass(this.size).array;

    for (let width = 1; width < this.size; width *= 2) {
      for (let start = 0; start < this.size; start += 2 * width) {
        const middle = Math.min(start + width, this.size);
        const end = Math.min(start + 2 * width, this.size);
        let left = start;
        let right = middle;

        for (let i = start; i < end; i++) {
          // <= keeps equal items in their original order (stable sort)
          if (
            left < middle &&
            (right >= end || source[left] <= source[right])
          ) {
            target[i] = source[left++];
          } else {
            target[i] = source[right++];
          }
        }
      }
      const previousSource = source;
      source = target;
      target = previousSource;
    }

    // The sorted result may have ended up in the scratch buffer.
    if (source !== this.array) {
      for (let i = 0; i < this.size; i++) {
        this.array[i] = source[i];
      }
    }
  }

  insertionSort() {
    // Everything left of i is already sorted; shift larger items one slot
    // right to open the gap where the current item belongs.
    for (let i = 1; i < this.size; i++) {
      const current = this.array[i];
      let gap = i;

      while (gap > 0 && this.array[gap - 1] > current) {
        this.array[gap] = this.array[gap - 1];
        gap--;
      }
      this.array[gap] = current;
    }
  }

  // Times the three sorting algorithms on identical random data.
  // Each round randomizes the array once and hands every algorithm the same
  // copy, so the timings are comparable. More rounds give steadier numbers,
  // since a single sort of a small array is faster than the timer's resolution.
  // The array is left sorted afterwards.
  performance(rounds = 100) {
    if (rounds < 1) {
      console.log("performance() needs at least 1 round");
      return;
    }

    const original = new MyArrayClass(this.size);

    const timeSort = (sort) => {
      for (let i = 0; i < this.size; i++) {
        this.array[i] = original.array[i];
      }
      const start = performance.now();
      sort.call(this);
      return performance.now() - start;
    };

    let sortAscMs = 0;
    let mergeSortMs = 0;
    let insertionSortMs = 0;

    for (let round = 0; round < rounds; round++) {
      this.fastRandom(0, 1000000);
      for (let i = 0; i < this.size; i++) {
        original.array[i] = this.array[i];
      }

      sortAscMs += timeSort(this.SortAsc);
      mergeSortMs += timeSort(this.mergeSort);
      insertionSortMs += timeSort(this.insertionSort);
    }

    const summarize = (totalMs) => ({
      "total (ms)": Number(totalMs.toFixed(3)),
      "average per sort (ms)": Number((totalMs / rounds).toFixed(5)),
    });

    const results = {
      SortAsc: summarize(sortAscMs),
      mergeSort: summarize(mergeSortMs),
      insertionSort: summarize(insertionSortMs),
    };

    console.log(
      "\n=== Sorting performance: " +
        this.size +
        " elements, " +
        rounds +
        " rounds ===",
    );
    console.table(results);

    return results;
  }
}
