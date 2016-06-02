var compile = require('./lib/compile');

compile('#include <stdio.h> \n int main() {printf("Hello world!"); \n return 0;}', (err, output) => {
    console.log(output);
});