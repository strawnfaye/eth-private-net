var incrementBytecode =
  '6080604052348015600f57600080fd5b5060a28061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063b8e010de146053575b600080fd5b603d605b565b6040518082815260200191505060405180910390f35b60596064565b005b60008054905090565b6001600080828254019250508190555056fea165627a7a723058206379e219f5f9972fcb48bf25ee98c822e9c02d1c5402d7cf32282f63504b86ac0029';

var incrementAbi = [
  {
    constant: true,
    inputs: [],
    name: 'get',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'set',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];
