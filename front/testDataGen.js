let measurePeriod = 5 * 60;

let object = {};

object.timestamps = [];
object.netUpWired = [];
object.netDownWired = [];
object.netUpWireless = [];
object.netDownWireless = [];
object.power = [];

let points = 86400/measurePeriod + 1;
let maxValue = [50000 * measurePeriod, 100000 * measurePeriod, 50000 * measurePeriod, 100000 * measurePeriod, 70];
let a = [];
let w = [];
let phi = [];

date = new Date();
date.setHours(0);
date.setMinutes(0);
date.setSeconds(0);
date.setMilliseconds(0);

for(let i = 0; i < 5; i++)
{
    a[i] = Math.random() * maxValue[i] / 2;
    w[i] = Math.random() / 2;
    phi[i] = Math.random() * 2 * Math.PI;
}

for(let i = 0; i < points; i++)
{
  object.timestamps.push(date / 1000); //Converting date to timestamp (in s)
  object.netUpWired.push(Math.floor(a[0] * (1 + Math.cos(w[0] * i + phi[0]))));
  object.netDownWired.push(Math.floor(a[1] * (1 + Math.cos(w[1] * i + phi[1]))));
  object.netUpWireless.push(Math.floor(a[2] * (1 + Math.cos(w[2] * i + phi[2]))));
  object.netDownWireless.push(Math.floor(a[3] * (1 + Math.cos(w[3] * i + phi[3]))));
  object.power.push(Math.floor(a[4] * (1 + Math.cos(w[4] * i + phi[4]))));

  date.setSeconds(date.getSeconds() + measurePeriod);
}

console.log(JSON.stringify(object, null, 2));