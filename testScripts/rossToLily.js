// Script to send ether from ross to lily through multiple txs

ross = '0xa9284bd5eec49c7a25037ed745089aee7b1ba25f';
lily = '0xb1b6a66a410edc72473d92decb3772bad863e243';
console.log('unlocking ross`s account');
personal.unlockAccount(ross, 'foobar123', 10000);

// Run 10 transactions
console.log();
for (var i = 0; i < 5; i++) {
  console.log('Transaction ', i, 'for ross:');
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
  rossBefore = eth.getBalance(ross);
  lilyBefore = eth.getBalance(lily);
  console.log('ross`s account balance before tx: ', rossBefore);
  console.log('lily`s account balance before tx: ', lilyBefore);
}

function sendTx() {
  console.log('sending a tx from ross to lily');
  txn = eth.sendTransaction({
    from: ross,
    to: lily,
    value: web3.toWei(1, 'szabo')
  });
}

function verifyTx() {
  rossAfter = eth.getBalance(ross);
  lilyAfter = eth.getBalance(lily);
  console.log('ross`s account balance after tx: ', rossAfter);
  console.log('lily`s account balance after tx: ', lilyAfter);
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
