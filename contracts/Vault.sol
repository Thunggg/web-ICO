// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is Ownable, AccessControlEnumerable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 private token;
    uint256 private maxWithdrawAmount;
    bool private withdrawEnabled;

    //Track user balances
    mapping(address => uint256) public userBalance;
    uint256 public totalDeposited;

    event Withdrawal(address indexed user, uint256 amount);
    event Deposit(address indexed user, uint256 amount);
    event TokenSet(address indexed token);
    event MaxWithdrawAmountSet(uint256 maxWithdrawAmount);
    event WithdrawEnabledSet(bool withdrawEnabled);

    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function withdraw(uint256 _amount) external nonReentrant{
        require(_amount <= maxWithdrawAmount, "Amount exceeds max withdraw amount"); // ko đc rút quá số tiền quy đinh
        require(withdrawEnabled, "Withdraw is not enabled"); // ko đc rút khi chưa mở
        require(_amount > 0, "Amount must be greater than 0"); // ko đc rút số tiền ko hợp lệ
        require(token.balanceOf(address(this)) >= _amount, "Insufficient balance"); // ko đc rút quá số tiền có trong hợp đồng
        require(userBalance[msg.sender] >= _amount, "Insufficient balance"); // ko đc rút quá số tiền của bản thân

        // Update balance
        userBalance[msg.sender] -= _amount;
        totalDeposited -= _amount;

        // Transfer tokens to user
        token.safeTransfer(msg.sender, _amount);
        emit Withdrawal(msg.sender, _amount);
    }

    function emergencyWithdraw(address _user, uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant{
        require(_amount > 0, "Amount must be greater than 0"); // ko đc rút số tiền ko hợp lệ
        require(token.balanceOf(address(this)) >= _amount, "Insufficient balance"); // ko đc rút quá số tiền có trong hợp đồng
        require(userBalance[_user] >= _amount, "Insufficient balance"); // ko đc rút quá số tiền của bản thân

        // Update balance
        userBalance[_user] -= _amount;
        totalDeposited -= _amount;

        // Transfer tokens to user
        token.safeTransfer(_user, _amount);
        emit Withdrawal(_user, _amount);
    }

    function deposit(uint256 _amount) external nonReentrant{
        require(_amount > 0, "Amount must be greater than 0"); // ko được nạp số âm
        require(address(token) != address(0), "Token must be set"); // token phải hợp lệ
        require(token.allowance(msg.sender, address(this)) >= _amount, "Insufficient allowance - please approve tokens first"); // user phải cho phép contract nạp số tiền lớn hơn amount

        // Update balance
        userBalance[msg.sender] += _amount;
        totalDeposited += _amount;


        token.safeTransferFrom(msg.sender, address(this), _amount);

        emit Deposit(msg.sender, _amount);
    }

    function setToken(IERC20 _token) external onlyOwner {
        require(address(_token) != address(0), "Invalid token address");
        token = _token;
        emit TokenSet(address(_token));
    }

    function setMaxWithdrawAmount(uint256 _maxWithdrawAmount) external onlyOwner {
        require(_maxWithdrawAmount > 0, "Max withdraw will be greather than 0");
        maxWithdrawAmount = _maxWithdrawAmount;
        emit MaxWithdrawAmountSet(_maxWithdrawAmount);

    }

    function setWithdrawEnabled(bool _withdrawEnabled) external onlyOwner {
        withdrawEnabled = _withdrawEnabled;
        emit WithdrawEnabledSet(_withdrawEnabled);

    }
}
