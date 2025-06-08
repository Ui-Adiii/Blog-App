import crypto from 'crypto'

console.log(crypto.randomBytes(64).toString('hex'))
console.log(Math.random().toString(9).slice(-4));
