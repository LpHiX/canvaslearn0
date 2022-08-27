"use strict";
var test = [];
for (let i = 0; i < 10; i++) {
    var testlete = [];
    for (let j = 0; j < 10; j++) {
        testlete.push(i * 10 + j);
    }
    test.push(testlete);
}
console.log(test);
