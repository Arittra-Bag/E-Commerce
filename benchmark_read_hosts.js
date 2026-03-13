const Benchmark = require('benchmark');

function readHostsOld(req) {
  const headers = [req.get("x-forwarded-host"), req.get("host")];

  return headers
    .flatMap((entry) => (entry ? entry.split(",") : []))
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .map((entry) => entry.split(":")[0]);
}

function readHostsNew(req) {
  const headers = [req.get("x-forwarded-host"), req.get("host")]
  const result = []

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i]
    if (!header) continue

    const parts = header.split(",")
    for (let j = 0; j < parts.length; j++) {
      const trimmed = parts[j].trim()
      if (trimmed) {
        result.push(trimmed.toLowerCase().split(":")[0])
      }
    }
  }

  return result
}

function readHostsNew2(req) {
  const result = []

  const processHeader = (header) => {
    if (!header) return
    const parts = header.split(",")
    for (let i = 0; i < parts.length; i++) {
      const trimmed = parts[i].trim()
      if (trimmed) {
        result.push(trimmed.toLowerCase().split(":")[0])
      }
    }
  }

  processHeader(req.get("x-forwarded-host"))
  processHeader(req.get("host"))

  return result
}

function readHostsReduce(req) {
  const headers = [req.get("x-forwarded-host"), req.get("host")]
  return headers.reduce((acc, entry) => {
    if (entry) {
      const parts = entry.split(",")
      for (const part of parts) {
        const trimmed = part.trim()
        if (trimmed) {
          acc.push(trimmed.toLowerCase().split(":")[0])
        }
      }
    }
    return acc
  }, [])
}

const req1 = {
  get: (name) => {
    if (name === 'x-forwarded-host') return 'Host1.com:8080, HOST2.COM ';
    if (name === 'host') return '  host3.local:3000 ';
    return undefined;
  }
};

const req2 = {
  get: (name) => {
    if (name === 'host') return 'example.com';
    return undefined;
  }
};

console.log("Old 1:", readHostsOld(req1));
console.log("New 1:", readHostsNew(req1));
console.log("New2 1:", readHostsNew2(req1));
console.log("Reduce 1:", readHostsReduce(req1));

console.log("Old 2:", readHostsOld(req2));
console.log("New 2:", readHostsNew(req2));
console.log("New2 2:", readHostsNew2(req2));
console.log("Reduce 2:", readHostsReduce(req2));

const suite = new Benchmark.Suite;

suite.add('Old', function() {
  readHostsOld(req1);
  readHostsOld(req2);
})
.add('New', function() {
  readHostsNew(req1);
  readHostsNew(req2);
})
.add('New2', function() {
  readHostsNew2(req1);
  readHostsNew2(req2);
})
.add('Reduce', function() {
  readHostsReduce(req1);
  readHostsReduce(req2);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': false });
