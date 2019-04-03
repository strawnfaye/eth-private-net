pragma solidity >=0.5.7;

contract Increment {
    uint x;

    function set() public {
        x += 1;
    }

    function get() public view returns (uint) {
        return x;
    }
}