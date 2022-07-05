//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract MemeCoin is ERC20, Ownable, ERC20Burnable {
    uint256 private supply = 10000;

    constructor() ERC20("PinkPanther", "PKP") {
        _mint(msg.sender, supply * 10**18);
        console.log("Initial tokens are minted.");
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        console.log("Tokens burned.");
    }

    function burn(uint256 amount) public override onlyOwner {
        _burn(msg.sender, amount);
        console.log("Tokens burned.");
    }
}
