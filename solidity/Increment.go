// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package increment

import (
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = abi.U256
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// IncrementABI is the input ABI used to generate the binding from.
const IncrementABI = "[{\"constant\":true,\"inputs\":[],\"name\":\"get\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"set\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"

// IncrementBin is the compiled bytecode used for deploying new contracts.
const IncrementBin = `6080604052348015600f57600080fd5b5060a28061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063b8e010de146053575b600080fd5b603d605b565b6040518082815260200191505060405180910390f35b60596064565b005b60008054905090565b6001600080828254019250508190555056fea165627a7a723058206379e219f5f9972fcb48bf25ee98c822e9c02d1c5402d7cf32282f63504b86ac0029`

// DeployIncrement deploys a new Ethereum contract, binding an instance of Increment to it.
func DeployIncrement(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *Increment, error) {
	parsed, err := abi.JSON(strings.NewReader(IncrementABI))
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	address, tx, contract, err := bind.DeployContract(auth, parsed, common.FromHex(IncrementBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &Increment{IncrementCaller: IncrementCaller{contract: contract}, IncrementTransactor: IncrementTransactor{contract: contract}, IncrementFilterer: IncrementFilterer{contract: contract}}, nil
}

// Increment is an auto generated Go binding around an Ethereum contract.
type Increment struct {
	IncrementCaller     // Read-only binding to the contract
	IncrementTransactor // Write-only binding to the contract
	IncrementFilterer   // Log filterer for contract events
}

// IncrementCaller is an auto generated read-only Go binding around an Ethereum contract.
type IncrementCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// IncrementTransactor is an auto generated write-only Go binding around an Ethereum contract.
type IncrementTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// IncrementFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type IncrementFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// IncrementSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type IncrementSession struct {
	Contract     *Increment        // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// IncrementCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type IncrementCallerSession struct {
	Contract *IncrementCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts    // Call options to use throughout this session
}

// IncrementTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type IncrementTransactorSession struct {
	Contract     *IncrementTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts    // Transaction auth options to use throughout this session
}

// IncrementRaw is an auto generated low-level Go binding around an Ethereum contract.
type IncrementRaw struct {
	Contract *Increment // Generic contract binding to access the raw methods on
}

// IncrementCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type IncrementCallerRaw struct {
	Contract *IncrementCaller // Generic read-only contract binding to access the raw methods on
}

// IncrementTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type IncrementTransactorRaw struct {
	Contract *IncrementTransactor // Generic write-only contract binding to access the raw methods on
}

// NewIncrement creates a new instance of Increment, bound to a specific deployed contract.
func NewIncrement(address common.Address, backend bind.ContractBackend) (*Increment, error) {
	contract, err := bindIncrement(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Increment{IncrementCaller: IncrementCaller{contract: contract}, IncrementTransactor: IncrementTransactor{contract: contract}, IncrementFilterer: IncrementFilterer{contract: contract}}, nil
}

// NewIncrementCaller creates a new read-only instance of Increment, bound to a specific deployed contract.
func NewIncrementCaller(address common.Address, caller bind.ContractCaller) (*IncrementCaller, error) {
	contract, err := bindIncrement(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &IncrementCaller{contract: contract}, nil
}

// NewIncrementTransactor creates a new write-only instance of Increment, bound to a specific deployed contract.
func NewIncrementTransactor(address common.Address, transactor bind.ContractTransactor) (*IncrementTransactor, error) {
	contract, err := bindIncrement(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &IncrementTransactor{contract: contract}, nil
}

// NewIncrementFilterer creates a new log filterer instance of Increment, bound to a specific deployed contract.
func NewIncrementFilterer(address common.Address, filterer bind.ContractFilterer) (*IncrementFilterer, error) {
	contract, err := bindIncrement(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &IncrementFilterer{contract: contract}, nil
}

// bindIncrement binds a generic wrapper to an already deployed contract.
func bindIncrement(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(IncrementABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Increment *IncrementRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _Increment.Contract.IncrementCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Increment *IncrementRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Increment.Contract.IncrementTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Increment *IncrementRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Increment.Contract.IncrementTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Increment *IncrementCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _Increment.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Increment *IncrementTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Increment.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Increment *IncrementTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Increment.Contract.contract.Transact(opts, method, params...)
}

// Get is a free data retrieval call binding the contract method 0x6d4ce63c.
//
// Solidity: function get() constant returns(uint256)
func (_Increment *IncrementCaller) Get(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _Increment.contract.Call(opts, out, "get")
	return *ret0, err
}

// Get is a free data retrieval call binding the contract method 0x6d4ce63c.
//
// Solidity: function get() constant returns(uint256)
func (_Increment *IncrementSession) Get() (*big.Int, error) {
	return _Increment.Contract.Get(&_Increment.CallOpts)
}

// Get is a free data retrieval call binding the contract method 0x6d4ce63c.
//
// Solidity: function get() constant returns(uint256)
func (_Increment *IncrementCallerSession) Get() (*big.Int, error) {
	return _Increment.Contract.Get(&_Increment.CallOpts)
}

// Set is a paid mutator transaction binding the contract method 0xb8e010de.
//
// Solidity: function set() returns()
func (_Increment *IncrementTransactor) Set(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Increment.contract.Transact(opts, "set")
}

// Set is a paid mutator transaction binding the contract method 0xb8e010de.
//
// Solidity: function set() returns()
func (_Increment *IncrementSession) Set() (*types.Transaction, error) {
	return _Increment.Contract.Set(&_Increment.TransactOpts)
}

// Set is a paid mutator transaction binding the contract method 0xb8e010de.
//
// Solidity: function set() returns()
func (_Increment *IncrementTransactorSession) Set() (*types.Transaction, error) {
	return _Increment.Contract.Set(&_Increment.TransactOpts)
}
