// Script to send ether from bob to lily through multiple txs

bob = '0x8691bf25ce4a56b15c1f99c944dc948269031801';
lily = '0xb1b6a66a410edc72473d92decb3772bad863e243';
console.log('unlocking bob`s account');
personal.unlockAccount(bob, 'foobar123', 10000);

// Run 10 transactions
console.log();
for (var i = 0; i < 100; i++) {
  console.log('Transaction ', i, 'for bob:');
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
  bobBefore = eth.getBalance(bob);
  lilyBefore = eth.getBalance(lily);
  console.log('bob`s account balance before tx: ', bobBefore);
  console.log('lily`s account balance before tx: ', lilyBefore);
}

function sendTx() {
  console.log('sending a tx from bob to lily');
  txn = eth.sendTransaction({
    from: bob,
    to: lily,
    value: web3.toWei(1, 'szabo')
  });
}

function verifyTx() {
  bobAfter = eth.getBalance(bob);
  lilyAfter = eth.getBalance(lily);
  console.log('bob`s account balance after tx: ', bobAfter);
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
