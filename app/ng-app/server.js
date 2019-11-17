const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var net = require('net');
var Web3 = require('web3');
const { spawn } = require('child_process');

var blocks = [];
var nodeNames = [];
var web3Refs = new Map();
var namesMap = new Map();
var addressMap = new Map();
namesMap.set('0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6', 'Alice');
namesMap.set('0x8691bf25ce4a56b15c1f99c944dc948269031801', 'Bob');
namesMap.set('0xb1b6a66a410edc72473d92decb3772bad863e243', 'Lily');
namesMap.set('0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1', 'Zach');
namesMap.set('0xa9284bd5eec49c7a25037ed745089aee7b1ba25f', 'Ross');

addressMap.set('Alice', '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6');
addressMap.set('Bob', '0x8691bf25ce4a56b15c1f99c944dc948269031801');
addressMap.set('Lily', '0xb1b6a66a410edc72473d92decb3772bad863e243');
addressMap.set('Zach', '0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1');
addressMap.set('Ross', '0xa9284bd5eec49c7a25037ed745089aee7b1ba25f');

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.route('/api/nodes').post((req, res) => {
  res.send(201, req.body);
});

app.listen(8000, () => {
  console.log('Server started!');
  resetNet();
});

function resetNet() {
  console.log('Resetting private net');
  const clean = spawn(`./eth-private-net clean`, [], {
    shell: true,
    cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
  });
  const init = spawn(`./eth-private-net init`, [], {
    shell: true,
    cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
  });
}

function startMinerProcess(name) {
  console.log('starting miner process for: ', name);
  const start = spawn(
    `./eth-private-net startMiner ${name.toLowerCase()}`,
    [],
    {
      shell: true,
      cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
    }
  );
  start.stdout.on('data', data => {
    console.log(`stdout for startMiner ${name}: ${data}`);
    console.log('block num: ', web3Refs.get(name).eth.blockNumber);
  });
}

function printBlocks(name) {
  console.log('starting printBlocks process for: ', name);
  const print = spawn(
    `./eth-private-net runTestScript ${name.toLowerCase()} printBlocks.js`,
    [],
    {
      shell: true,
      cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
    }
  );
  print.stdout.on('data', data => {
    console.log(`stdout for printBlocks ${name}: ${data}`);
    console.log('block num: ', web3Refs.get(name).eth.blockNumber);
  });
}

function startNodeProcess(name) {
  console.log('starting node process for: ', name);
  const start = spawn(`./eth-private-net start ${name}`, [], {
    shell: true,
    cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
  });
}

function connectPeers() {
  console.log('Connecting all peers...');
  for (let i = 0; i < nodeNames.length - 1; i++) {
    let peerA = nodeNames[i];
    for (let j = 1; j < nodeNames.length; j++) {
      let peerB = nodeNames[j];
      const connect = spawn(`./eth-private-net connect ${peerA} ${peerB}`, [], {
        shell: true,
        cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
      });
      connect.stdout.on('data', data => {
        console.log(`stdout for connect ${peerA} ${peerB}: ${data}`);
      });
    }
  }
}

function connectToNode(name) {
  return new Promise(function(resolve, reject) {
    var web3 = new Web3(
      new Web3.providers.IpcProvider(`../../${name}/geth.ipc`, net)
    );
    web3.eth
      .getCoinbase()
      .then(function(address) {
        nodeNames.push(namesMap.get(address.toString()));
        web3Refs.set(nodeNames[0], web3);
        resolve();
      })
      .catch(error => {
        console.log('error:', error);
        reject(error);
      });
  });
}

function checkIfMining(name) {
  return new Promise(function(resolve, reject) {
    web3Refs
      .get(name)
      .eth.isMining()
      .then(x => {
        console.log('isMining() for', name, 'returns', x);
        resolve();
      });
  });
}

function sendTransaction(to, from) {
  const sendTx = spawn(
    `./eth-private-net sendTransaction ${from.toLowerCase()} ${to.toLowerCase()}`,
    [],
    {
      shell: true,
      cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
    }
  );
  sendTx.stdout.on('data', data => {
    console.log(`stdout for sendTx ${to} ${from}: ${data}`);
  });
}

app.route('/api/startNodes').get((req, res) => {
  if (nodeNames && nodeNames.length) {
    console.log('nodes already running:', nodeNames);
    res.send(nodeNames);
  } else {
    startNodeProcess('bob');
    startNodeProcess('alice');
    startNodeProcess('lily');
    startNodeProcess('ross');
    startNodeProcess('zach');
    setTimeout(function() {
      console.log('Connecting to geth IPCs...');
      Promise.all([
        connectToNode('bob'),
        connectToNode('alice'),
        connectToNode('lily'),
        connectToNode('ross'),
        connectToNode('zach')
      ]).then(() => {
        connectPeers();
        res.send(nodeNames);
      });
    }, 4000);
  }
});

app.route('/api/startMiner/:name').get((req, res) => {
  const temp = req.params['name'];
  console.log('startMiner called for: ', temp);
  startMinerProcess(temp);
  setTimeout(function() {
    Promise.all([checkIfMining(temp)]).then(() => {
      res.send(true);
    });
  }, 2000);
});

app.route('/api/sendTx/:from/:to').get((req, res) => {
  const from = req.params['from'];
  const to = req.params['to'];
  sendTransaction(to, from);
  res.send(true);
});

app.route('/api/nodes').get((req, res) => {
  res.send(nodeNames);
});

app.route('/api/printBlocks/:name').get((req, res) => {
  const miner = req.params['name'];
  printBlocks(miner);
  res.send(true);
});

app.route('/api/nodes/:name').get((req, res) => {
  const requestedNodeName = req.params['name'];
  res.send({ name: requestedNodeName });
});

app.route('/api/nodes/:name').put((req, res) => {
  res.send(200, req.body);
});
