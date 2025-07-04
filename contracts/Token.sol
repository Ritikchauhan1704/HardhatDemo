// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract Token {
    string public name = "HardHat Token";
    string public symbol = "HHT";
    uint public totalSupply = 10000;

    address public owner;

    mapping(address => uint) public balances;

    constructor(){
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function transfer(address _to, uint _amount) external {
        require(balances[msg.sender] >= _amount, "Not enough tokens");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

    }

    function balanceOf(address _owner) external view returns(uint){
        return balances[_owner];
    }
}