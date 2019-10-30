var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var net = require('net');
var Web3 = require('web3');

var app = express();
var nodeNames = [];
var blocks = [];
var web3Refs = new Map();
var namesMap = new Map();
var setWeb3 = true;
namesMap.set('0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6', 'Alice');
namesMap.set('0x8691bf25ce4a56b15c1f99c944dc948269031801', 'Bob');
namesMap.set('0xb1b6a66a410edc72473d92decb3772bad863e243', 'Lily');
namesMap.set('0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1', 'Zach');
namesMap.set('0xa9284bd5eec49c7a25037ed745089aee7b1ba25f', 'Ross');

// var alice_web3 = new Web3(
//   new Web3.providers.IpcProvider('../../alice/geth.ipc', net)
// );
// alice_web3.eth
//   .getCoinbase()
//   .then(function(address) {
//     nodeNames.push(namesMap.get(address.toString()));
//     console.log(nodeNames);
//     web3Refs.set(nodeNames[1], alice_web3);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// var lily_web3 = new Web3(
//   new Web3.providers.IpcProvider('../../lily/geth.ipc', net)
// );
// lily_web3.eth
//   .getCoinbase()
//   .then(function(address) {
//     nodeNames.push(namesMap.get(address.toString()));
//     console.log(nodeNames);
//     web3Refs.set(nodeNames[2], lily_web3);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// var ross_web3 = new Web3(
//   new Web3.providers.IpcProvider('../../ross/geth.ipc', net)
// );
// ross_web3.eth
//   .getCoinbase()
//   .then(function(address) {
//     nodeNames.push(namesMap.get(address.toString()));
//     console.log(nodeNames);
//     web3Refs.set(nodeNames[3], ross_web3);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// var zach_web3 = new Web3(
//   new Web3.providers.IpcProvider('../../zach/geth.ipc', net)
// );
// zach_web3.eth
//   .getCoinbase()
//   .then(function(address) {
//     nodeNames.push(namesMap.get(address.toString()));
//     console.log(nodeNames);
//     web3Refs.set(nodeNames[4], zach_web3);
//   })
//   .catch(error => {
//     console.log(error);
//   });

const util = require('util');
const { spawn } = require('child_process');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('pages/index', {
    nodeNames: nodeNames,
    blocks: blocks
  });
});

app.get('/clickedStartNodeBob', function(req, res) {
  res.status(200);
  const start = spawn('./eth-private-net start bob', [], {
    shell: true,
    cwd: '/Users/faye/Documents/School/Senior Design/eth-private-net'
  });
  console.log('pid: ', start.pid);
  start.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });
  start.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
  if (start.stdout) {
    console.log('trying to connect');
    var bob_web3 = new Web3(
      new Web3.providers.IpcProvider('../../bob/geth.ipc', net)
    );
    bob_web3.eth
      .getCoinbase()
      .then(function(address) {
        nodeNames.push(namesMap.get(address.toString()));
        console.log(nodeNames);
        web3Refs.set(nodeNames[0], bob_web3);
      })
      .catch(error => {
        console.log(error);
      });
  }
});

app.get('/clickedStartMiner', function(req, res) {
  function startMiner() {
    const { stdout, stderr } = exec(
      'cd ../..; ./eth-private-net startMiner bob'
    )
      .then(result => {
        console.log('result: ', result);
      })
      .catch(error => {
        console.log('error: ', error);
      });
    if (stderr) {
      console.log(stderr);
    } else {
      return stdout;
    }
  }
  startMiner().then(console.log('started miner'));
});

app.get('/clickedShowBlocks', function(req, res) {
  res.status(200);
  var lastBlockNum;
  bob_web3.eth
    .getBlockNumber()
    .then(res => {
      console.log(res);
      lastBlockNum = res;
      for (let i = 0; i < lastBlockNum; i++) {
        console.log('i: ', i);
        bob_web3.eth
          .getBlock(i)
          .then(res => {
            console.log('block: ', res);
            blocks.push(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
      console.log(blocks);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(8080);
console.log('8080 is the magic port');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
