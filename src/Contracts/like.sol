// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Minimal ERC-20 token for Likes
contract LikeToken is ERC20, Ownable {
    constructor() ERC20("LikeToken", "LIKE") Ownable(msg.sender) {}
    
    // Mint function (only owner can call)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}