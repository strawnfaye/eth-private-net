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
namesMap.set('0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6', 'Alice');
namesMap.set('0x8691bf25ce4a56b15c1f99c944dc948269031801', 'Bob');
namesMap.set('0xb1b6a66a410edc72473d92decb3772bad863e243', 'Lily');
namesMap.set('0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1', 'Zach');
namesMap.set('0xa9284bd5eec49c7a25037ed745089aee7b1ba25f', 'Ross');

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
});

function startMinerProcess(name) {
  console.log('starting miner process for: ', name);
  const start = spawn(`./eth-private-net startMiner ${name}`, [], {
    shell: true,
    cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
  });
}

function startNodeProcess(name) {
  console.log('starting node process for: ', name);
  const start = spawn(`./eth-private-net start ${name}`, [], {
    shell: true,
    cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
  });
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
        console.log(error);
        reject(error);
      });
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
      console.log('Connecting...');
      Promise.all([
        connectToNode('bob'),
        connectToNode('alice'),
        connectToNode('lily'),
        connectToNode('ross'),
        connectToNode('zach')
      ]).then(() => res.send(nodeNames));
    }, 4000);
  }
});

app.route('/api/startMiner/:name').get((req, res) => {
  const temp = req.params['name'];
  console.log('temp: ', temp);
  startMinerProcess(temp);
  web3Refs
    .get(temp)
    .eth.isMining()
    .then(x => {
      console.log(x);
      res.send(x);
    });
});

app.route('/api/nodes').get((req, res) => {
  res.send(nodeNames);
});

app.route('/api/nodes/:name').get((req, res) => {
  const requestedNodeName = req.params['name'];
  res.send({ name: requestedNodeName });
});

app.route('/api/nodes/:name').put((req, res) => {
  res.send(200, req.body);
});
