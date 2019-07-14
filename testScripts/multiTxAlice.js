// Script to send ether from alice to lily through multiple txs

alice = '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6';
lily = '0xb1b6a66a410edc72473d92decb3772bad863e243';
console.log('unlocking alice`s account');
personal.unlockAccount(alice, 'foobar123', 10000);

console.log('First transaction:');
testTx();
console.log('Second transaction:');
testTx();
console.log('Third transaction:');
testTx();

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
  aliceBefore = eth.getBalance(alice);
  lilyBefore = eth.getBalance(lily);
  console.log('alice`s account balance before tx: ', aliceBefore);
  console.log('lily`s account balance before tx: ', lilyBefore);
}

function sendTx() {
  console.log('sending a tx from alice to lily');
  txn = eth.sendTransaction({
    from: alice,
    to: lily,
    value: web3.toWei(1, 'szabo')
  });
}

function verifyTx() {
  aliceAfter = eth.getBalance(alice);
  lilyAfter = eth.getBalance(lily);
  console.log('alice`s account balance after tx: ', aliceAfter);
  console.log('lily`s account balance after tx: ', lilyAfter);
  // TODO: more exact calculation with gas and stuff for pass/fail condition
  if (
    parseInt(aliceBefore, 10) > parseInt(aliceAfter, 10) &&
    parseInt(lilyBefore, 10) < parseInt(lilyAfter, 10)
  ) {
    console.log('PASSED! Transaction successfully completed.');
  } else {
    console.log('FAIL. Something went wrong with this transaction.');
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
