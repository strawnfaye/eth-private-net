var a_BIN =
  '0x608060405234801561001057600080fd5b5060c68061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632baeceb71460415780636d4ce63c146049578063d09de08a146065575b600080fd5b6047606d565b005b604f607f565b6040518082815260200191505060405180910390f35b606b6088565b005b60016000808282540392505081905550565b60008054905090565b6001600080828254019250508190555056fea165627a7a72305820ed2cfa27f1752d694f5b0fac7b43254211cbe3ff9943c179d195af51919d4ff80029';
var a_ABI = [
  {
    constant: false,
    inputs: [],
    name: 'decrement',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
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
    name: 'increment',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

var a_SRC =
  'pragma solidity >=0.5.7;  contract TestA { uint a; function increment() public {a += 1;} function decrement() public {a -= 1;}function get() public view returns (uint) {return a;}}';
