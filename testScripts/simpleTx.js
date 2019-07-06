// Very simple script to send ether from alice to lily

console.log('unlocking alice`s account');
personal.unlockAccount(
  '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6',
  'foobar123',
  10000
);
console.log('sending a tx from alice to lily');
txn = eth.sendTransaction({
  from: '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6',
  to: '0xb1b6a66a410edc72473d92decb3772bad863e243',
  value: web3.toWei(1, 'szabo')
});
