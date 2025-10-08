let a = 10;
let b = 3;
console.log(a + b); 
console.log(a - b); 
console.log(a * b);
console.log(a / b); 
console.log(a % b); 
const user = 'Olia';
const points = 42;
const msg = `Привет, ${user}! У тебя ${points} очков.`;
console.log(msg);

const score = 75;
if (score >= 90) {
console.log('Отлично');
} else if (score >= 60) {
console.log('Хорошо');
} else {
console.log('Нужно подтянуть');
}
const result = score >= 60 ? 'зачёт' : 'незачёт';
console.log(result);