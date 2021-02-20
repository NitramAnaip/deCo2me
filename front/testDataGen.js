let object = {};

object.measurePeriod = 5 * 60;
object.netUpWired = [];
object.netDownWired = [];
object.netUpWireless = [];
object.netDownWireless = [];
object.power = [];

let points = 86400/object.measurePeriod + 1;
let maxValue = [3000000000, 1500000000, 3000000000, 1500000000, 70];
let a = [];
let w = [];
let phi = [];

for(let i = 0; i < 5; i++)
{
    a[i] = Math.random() * maxValue[i] / 2;
    w[i] = Math.random() / 2;
    phi[i] = Math.random() * 2 * Math.PI;
}

for(let i = 0; i < points; i++)
{
  object.netUpWired.push(Math.floor(a[0] * (1 + Math.cos(w[0] * i + phi[0]))));
  object.netDownWired.push(Math.floor(a[1] * (1 + Math.cos(w[1] * i + phi[1]))));
  object.netUpWireless.push(Math.floor(a[2] * (1 + Math.cos(w[2] * i + phi[2]))));
  object.netDownWireless.push(Math.floor(a[3] * (1 + Math.cos(w[3] * i + phi[3]))));
  object.power.push(Math.floor(a[4] * (1 + Math.cos(w[4] * i + phi[4]))));
}

console.log(JSON.stringify(object, null, 2));