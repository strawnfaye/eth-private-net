// Very simple script to send ether from alice to lily

alice = '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6';
lily = '0xb1b6a66a410edc72473d92decb3772bad863e243';
aliceBefore = eth.getBalance(alice);
lilyBefore = eth.getBalance(lily);
console.log('alice`s account balance before tx: ', aliceBefore);
console.log('lily`s account balance before tx: ', lilyBefore);
console.log('unlocking alice`s account');
personal.unlockAccount(alice, 'foobar123', 10000);
console.log('sending a tx from alice to lily');
txn = eth.sendTransaction({
  from: alice,
  to: lily,
  value: web3.toWei(1, 'szabo')
});
aliceAfter = eth.getBalance(alice);
lilyAfter = eth.getBalance(lily);
console.log('alice`s account balance after tx: ', aliceAfter);
console.log('lily`s account balance after tx: ', lilyAfter);
if (aliceBefore > aliceAfter && lilyBefore < lilyAfter) {
  console.log('PASSED! Transaction successfully completed.');
} else {
  console.log('FAIL. Something went wrong with this transaction.');
}
