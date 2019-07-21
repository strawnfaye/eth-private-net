// Prints the block object for each block Bob has mined.
// the "true" param tells the method to send us the transactions
// from the block as an array of objects instead of a hash.
lastBlock = eth.blockNumber;
console.log(
  '---------------------------------------------------------------------------------'
);
for (var i = 0; i < lastBlock; i++) {
  eth.getBlock(i, function(error, result) {
    if (!error) {
      console.log('| BLOCK NUMBER ', i);
      console.log(
        '|            Miner of block: ',
        JSON.stringify(result.miner)
      );
      console.log('|     Transactions in block: ');
      console.log('|       ............................................');
      result.transactions.forEach(function(item) {
        var tx = eth.getTransaction(item);
        console.log('|       .   Transaction Hash: ', JSON.stringify(tx.hash));
        console.log('|       .             Sender: ', JSON.stringify(tx.from));
        console.log('|       .           Receiver: ', JSON.stringify(tx.to));
        console.log('|       ............................................');
      });
      console.log(
        '---------------------------------------------------------------------------------'
      );
    } else console.error(error);
  });
}
