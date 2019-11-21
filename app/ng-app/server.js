const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var net = require('net');
var Web3 = require('web3');
const { spawn } = require('child_process');
var readline = require('readline');
var fs = require('fs');

/**
 * The full path to the eth-private-net directory on the local file system.
 * NOTE: Must be customized the the user's personal file system!
 */
var path = '/Users/faye/Documents/School/Senior Design/eth-private-net';

/**
 * A list of the defined names of private net nodes.
 */
var nodeNames = [];

/**
 * The name of a node that is actively mining.
 */
var activeMiner = null;

/**
 * A map containing references to the web3 connection for each node. A string
 * representation of the node's name is used as the key.
 */
var web3Refs = new Map();

/**
 * A map that provides the name of a node when the node's coinbase address
 * is used as the key.
 */
var namesMap = new Map();
namesMap.set('0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6', 'Alice');
namesMap.set('0x8691bf25ce4a56b15c1f99c944dc948269031801', 'Bob');
namesMap.set('0xb1b6a66a410edc72473d92decb3772bad863e243', 'Lily');
namesMap.set('0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1', 'Zach');
namesMap.set('0xa9284bd5eec49c7a25037ed745089aee7b1ba25f', 'Ross');

/**
 * A map that provides the coinbase address of a node when the node's name
 * is used as the key.
 */
var addressMap = new Map();
addressMap.set('Alice', '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6');
addressMap.set('Bob', '0x8691bf25ce4a56b15c1f99c944dc948269031801');
addressMap.set('Lily', '0xb1b6a66a410edc72473d92decb3772bad863e243');
addressMap.set('Zach', '0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1');
addressMap.set('Ross', '0xa9284bd5eec49c7a25037ed745089aee7b1ba25f');

// Allows this backend to connect to the Angular frontend through its URL.
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// app.route('/api/nodes').post((req, res) => {
//   res.send(201, req.body);
// });

// Starts this backend server and resets the private net.
app.listen(8000, () => {
  console.log('~**Server started!**~');
  cleanLogs();
  resetNet();
});

/**
 * Invoked when frontend service makes an http.get() call to
 * this route. If no nodes are running, starts node process for
 * each of the 5 defined identites on the private net. After
 * a brief forced timeout, connects to each of the nodes' IPC
 * providers.
 *
 * @url 'http://localhost:8000/api/startNodes'
 * @returns the list of nodes running on the private net.
 */
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

// Returns a list of names of all running nodes on the private net.
app.route('/api/nodes').get((req, res) => {
  res.send(nodeNames);
});

// Returns the balance of the account associated with the node with
// the given name.
app.route('/api/getBalance/:name').get((req, res) => {
  const name = req.params['name'];
  web3Refs
    .get(name)
    .eth.getBalance(addressMap.get(name))
    .then(balance => {
      console.log('balance:', balance);
      res.send(balance);
    });
});

// Returns the actively mining node. If none exists, returns null.
app.route('/api/getMiner').get((req, res) => {
  console.log('about to send back that active miner is: ', activeMiner);
  res.send(JSON.stringify(activeMiner));
});

// Starts the mining process for the node with the given name.
app.route('/api/startMiner/:name').get((req, res) => {
  const temp = req.params['name'];
  console.log('startMiner called for: ', temp);
  startMinerProcess(temp);
  setTimeout(function() {
    Promise.all([checkIfMining(temp)]).then(() => {
      activeMiner = temp;
      res.send(true);
    });
  }, 2000);
});

/**
 * Invoked when frontend service makes an http.get() call to
 * this route. Retrieves a list of relevant logs statements from
 * the given node's console.log file.
 *
 * @params {string} miner: the mining node to retrieve logs for.
 * @returns an array of strings containing recent relevant log statements.
 */
app.route('/api/getMinerLogs/:miner/:line').get((req, res) => {
  const miner = req.params['miner'];
  const line = req.params['line'];
  getMinerLogs(miner, line).then(result => {
    // console.log('lines in .get() ', result);
    res.send(result);
  });
});

// Sends an arbitrary transaction from the given "from" node to the
// given "to" node.
app.route('/api/sendTx/:from/:to').get((req, res) => {
  const from = req.params['from'];
  const to = req.params['to'];
  sendTransaction(to, from);
  res.send(true);
});

// Sends recent blocks mined by the given node "miner" since the given
// "atBlock" block number.
app.route('/api/getBlocks/:miner/:atBlock').get((req, res) => {
  const miner = req.params['miner'];
  const fromBlock = req.params['atBlock'];
  // console.log('miner in .get: ', miner);
  // console.log('fromBlock in .get: ', fromBlock);
  updateBlocks(miner, fromBlock).then(result => {
    // console.log('result', result);
    res.send(result);
  });
});

/**
 * Runs bash scripts on the private net to reset the blockchain
 * to a genesis state.
 */
function resetNet() {
  console.log('Resetting private net');
  const clean = spawn(`./eth-private-net clean`, [], {
    shell: true,
    cwd: path
  });
  const init = spawn(`./eth-private-net init`, [], {
    shell: true,
    cwd: path
  });
}

/**
 * Runs a bash script to clean out the console.log files for
 * each of the nodes on the private net.
 */
function cleanLogs() {
  console.log('Cleaning logs');
  const clean = spawn(`./cleanlogs`, [], {
    shell: true,
    cwd: path
  });
}

/**
 * Runs bash scripts on the private net to start the miner for a given
 * node
 *
 * @param {string} name the name of the node to initiate the mining process
 * for.
 */
function startMinerProcess(name) {
  console.log('starting miner process for: ', name);
  const start = spawn(
    `./eth-private-net startMiner ${name.toLowerCase()}`,
    [],
    {
      shell: true,
      cwd: path
    }
  );
  start.stdout.on('data', data => {
    console.log(`stdout for startMiner ${name}: ${data}`);
  });
}

/**
 * Runs a bash script to start the given node on the private
 * net.
 *
 * @param {string} name the name of the node to run on the private net.
 */
function startNodeProcess(name) {
  console.log('starting node process for: ', name);
  const start = spawn(`./eth-private-net start ${name}`, [], {
    shell: true,
    cwd: path
  });
}

/**
 * If the given node is running on the private net, connects that
 * node to a web3 by accessing its IPC provider via a relative filepath.
 * The web3 reference for this node is added to the web3Refs map, using
 * the node's name as the key.
 *
 * @param {string} name the name of the running node to connect to web3.
 * @returns an empty Promise indicating that the connection has been set.
 */
function connectToNode(name) {
  return new Promise(function(resolve, reject) {
    var web3 = new Web3(
      new Web3.providers.IpcProvider(`../../${name}/geth.ipc`, net)
    );
    web3.eth
      .getCoinbase()
      .then(function(address) {
        temp = namesMap.get(address.toString());
        nodeNames.push(temp);
        web3Refs.set(temp, web3);
        resolve();
      })
      .catch(error => {
        console.log('error:', error);
        reject(error);
      });
  });
}

/**
 * Runs a bash script on each running node to connect it as a peer to all
 * other running nodes.
 */
function connectPeers() {
  console.log('Connecting all peers...');
  for (let i = 0; i < nodeNames.length - 1; i++) {
    let peerA = nodeNames[i];
    for (let j = 1; j < nodeNames.length; j++) {
      let peerB = nodeNames[j];
      const connect = spawn(`./eth-private-net connect ${peerA} ${peerB}`, [], {
        shell: true,
        cwd: path
      });
      connect.stdout.on('data', data => {
        console.log(`stdout for connect ${peerA} ${peerB}: ${data}`);
      });
    }
  }
}

/**
 * Uses the given node's web3 reference to check whether the node
 * is currently mining.
 *
 * @param {string} name the name of the node to check.
 * @returns Promise returns a boolean. True if the node is current mining,
 * false otherwise.
 */
function checkIfMining(name) {
  return new Promise(function(resolve, reject) {
    web3Refs
      .get(name)
      .eth.isMining()
      .then(mining => {
        console.log('isMining() for', name, 'returns', mining);
        resolve(mining);
      });
  });
}

/**
 * Runs a bash script to send a transaction from one node's account to another.
 * NOTE: Currently sends an arbitrary amount.
 * TODO: Modify to use web3 or to include bash script parameter to send a specified
 * amount.
 *
 * @param {string} to the name of the node whose account will receive the tx.
 * @param {string} from the name of the node whose account is sending the tx.
 */
function sendTransaction(to, from) {
  const sendTx = spawn(
    `./eth-private-net sendTransaction ${from.toLowerCase()} ${to.toLowerCase()}`,
    [],
    {
      shell: true,
      cwd: path
    }
  );
  sendTx.stdout.on('data', data => {
    console.log(`stdout for sendTx ${to} ${from}: ${data}`);
  });
}

/**
 * Retrieves new blocks mined by the miner since the last call from the frontend.
 *
 * @param {string} miner the name of the mining node to retrieve the blockchain from.
 * @param {number} fromBlock the number of the latest block the frontend has received
 * from the backend.
 * @returns Promise returns an array of block objects, starting from the block after the
 * frontend's latest and ending at the true last block for the miner.
 */
function updateBlocks(miner, fromBlock) {
  return new Promise(function(resolve, reject) {
    var promises = [];
    var latestBlocks = [];
    web3Refs
      .get(miner)
      .eth.getBlockNumber()
      .then(toBlock => {
        for (let i = fromBlock + 1; i <= toBlock; i++) {
          promises.push(web3Refs.get(miner).eth.getBlock(i));
        }
        Promise.all(promises).then(results => {
          results.forEach(result => {
            latestBlocks.push(result);
          });
          latestBlocks.sort((a, b) => {
            return a.number - b.number;
          });
          resolve(latestBlocks);
        });
      });
  });
}

/**
 * Parses the console.log file for the given node and picks out relevant
 * statements to send back to the frontend.
 *
 * @param {string} miner the name of the mining node to read the log file for.
 * @param {number} startLine the line number to start reading through in the
 * log file.
 * @returns Promise returns an array of strings containing relevant debug statements
 * from the miner.
 */
function getMinerLogs(miner, startLine) {
  return new Promise(resolve => {
    var myInterface = readline.createInterface({
      input: fs.createReadStream(`${path}/${miner}/console.log`)
    });

    var lines = [];
    var lineno = 0;
    myInterface
      .on('line', function(line) {
        lineno++;
        if (lineno > startLine) {
          if (line.includes('Successfully sealed new block')) {
            lines.push(line);
          }
        }
      })
      .on('close', function(line) {
        resolve(lines);
      });
  });
}
