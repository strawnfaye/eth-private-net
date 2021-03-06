// JavaScript to automate contract deployment for arement smart contract.
// Run: loadScript('testScripts/deployarement.js') from the private net
// geth console, running as Bob.

console.log('Start miner to write new version of contract to chain');
miner.start();
console.log('Load and unlock');
loadScript('solidity/TestA.sol.js');
eth.defaultAccount = bob;
personal.unlockAccount(bob, 'foobar123', 10000);
console.log('Deploy contract');
var aDeploy = { from: bob, data: a_BIN, gas: 900000 };
var aContract = eth.contract(a_ABI);
var aGas = eth.estimateGas(aDeploy);
var aInstance = aContract.new(aDeploy);
ii = aInstance;
//console.log(Date.now()/100);
console.log('Block: ' + eth.blockNumber);
console.log('Please wait for contract deploy transaction to be mined');
console.log('Block: ' + eth.blockNumber);
personal.unlockAccount(bob, 'foobar123', 10000);
console.log('Block: ' + eth.blockNumber);
personal.unlockAccount(bob, 'foobar123', 10000);
console.log(
  'Test RAA to match result and see if load is ok (also necessary to setup txpool address)'
);
console.log('Use: ii.get([2,2,2])');
console.log('Also: ii.address eth.blockNumber');
