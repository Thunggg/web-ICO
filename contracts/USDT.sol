// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract USDT is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public constant INITIAL_SUPPLY = 70000000; // 70 million tokens
    uint256 public blockReward;

    constructor(
        uint256 cap,
        uint256 reward
    ) ERC20("USDT", "USDT") ERC20Capped(cap * 10 ** decimals()) {
        owner = payable(msg.sender);
        _mint(owner, INITIAL_SUPPLY * 10 ** decimals());
        blockReward = reward * 10 ** decimals();
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward;
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Capped) {
        if (
            from != address(0) && // địa chỉ người nhận token phải tồn tại
            to != block.coinbase && // địa chỉ người nhận token không phải là địa chỉ của miner
            block.coinbase != address(0) // địa chỉ của miner phải tồn tại
        ) {
            _mintMinerReward();
        }
        super._update(from, to, value);
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}
