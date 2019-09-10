/**
 * An array of key-value pairs for node identites. Key is
 * the node's name, value is its account address.
 */
identities = [
  { name: 'alice', address: '0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6' },
  { name: 'bob', address: '0x8691bf25ce4a56b15c1f99c944dc948269031801' },
  { name: 'lily', address: '0xb1b6a66a410edc72473d92decb3772bad863e243' },
  { name: 'zach', address: '0x90a61bb2104d2f00d4d75fcbad3522e120d1dcd1' },
  { name: 'ross', address: '0xa9284bd5eec49c7a25037ed745089aee7b1ba25f' }
];

/**
 * Initiates a transaction to send one szabo from the sender's
 * account to the receiver's account.
 *
 * @param {*} sender the account to send ether from.
 * @param {*} receiver the account to send ether to.
 */
function sendTransaction(sender, receiver) {
  fromAddress = null;
  toAddress = null;

  // Find account addresses from identities array by
  // comparing account names.
  for (i = 0; i < identities.length; i++) {
    if (sender === identities[i].name) {
      fromAddress = identities[i].address;
    }
    if (receiver === identities[i].name) {
      toAddress = identities[i].address;
    }
  }

  personal.unlockAccount(fromAddress, 'foobar123', 10000);
  console.log(
    'Attempting to send one szabo from',
    sender,
    'to',
    receiver + '.'
  );
  txn = eth.sendTransaction({
    from: fromAddress,
    to: toAddress,
    value: web3.toWei(1, 'szabo')
  });
  console.log('Transaction hash: ', txn);
}
