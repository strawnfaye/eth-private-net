// Script to send ether from zach to ross through multiple txs

zach = '0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1';
ross = '0xa9284bd5eec49c7a25037ed745089aee7b1ba25f';
console.log('unlocking zach`s account');
personal.unlockAccount(zach, 'foobar123', 10000);

// Run 10 transactions
console.log();
for (var i = 0; i < 3; i++) {
  console.log('Transaction ', i, 'for zach:');
  testTx();
}

function testTx() {
  initialBalances();
  console.log('Timeout to let miner mine a few blocks....');
  sleep(5000);
  sendTx();
  console.log('Timeout to let miner process tx....');
  sleep(5000);
  verifyTx();
}

function initialBalances() {
  zachBefore = eth.getBalance(zach);
  rossBefore = eth.getBalance(ross);
  console.log('zach`s account balance before tx: ', zachBefore);
  console.log('ross`s account balance before tx: ', rossBefore);
}

function sendTx() {
  console.log('sending a tx from zach to ross');
  txn = eth.sendTransaction({
    from: zach,
    to: ross,
    value: web3.toWei(1, 'szabo')
  });
}

function verifyTx() {
  zachAfter = eth.getBalance(zach);
  rossAfter = eth.getBalance(ross);
  console.log('zach`s account balance after tx: ', zachAfter);
  console.log('ross`s account balance after tx: ', rossAfter);
  // TODO: more exact calculation with gas and stuff for pass/fail condition
  if (eth.getTransactionReceipt(txn)) {
    console.log('PASSED! Transaction ', txn, ' successfully completed.');
    console.log(
      'Found in block number ',
      eth.getTransactionReceipt(txn).blockNumber
    );
  } else {
    console.log('FAIL. Something went wrong with transaction ', txn);
  }
}

// Custom function to allow thread to wait for a given number of milliseconds
// before executing the next line of code.
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}
