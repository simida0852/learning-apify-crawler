function foo() {
    console.log('???', this.a);
}

function active(fn) {
    fn()
}


var a = 20

var obj = {
    a: 10,
    getA: foo,
    active: active
}

// =>  10
console.log('1');
active(obj.getA)

debugger
// => 10
console.log('2');
obj.active(obj.getA)
