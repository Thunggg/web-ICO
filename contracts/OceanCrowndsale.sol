//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract OceanCrowdsale is Ownable {
    using SafeERC20 for IERC20;
    address payable public _wallet;
    uint256 public ETH_rate;
    uint256 public USDT_rate;
    IERC20 public token;
    IERC20 public usdtToken;

    event BuyTokenByETH(address buyer, uint256 amount);
    event BuyTokenByUSDT(address buyer, uint256 amount);
    event SetUSDTToken(IERC20 tokenAddress);
    event SetETHRate(uint256 newRate);
    event SetUSDTRate(uint256 newRate);
    event WithdrawETH(address owner, uint256 amount);
    event WithdrawERC20(address owner, uint256 amount);

    constructor(
        uint256 eth_rate, // tỷ giá từ ETH sang token
        uint256 usdt_rate, // tỷ giá từ USDT sang token
        address payable wallet, // địa chỉ nhận ETH
        IERC20 icotoken // token được bán
    ) Ownable(msg.sender) {
        require(eth_rate > 0, "ETH rate must be greater than 0");
        require(usdt_rate > 0, "USDT rate must be greater than 0");
        require(wallet != address(0), "Wallet cannot be zero address");
        require(
            address(icotoken) != address(0),
            "Token cannot be zero address"
        );
        ETH_rate = eth_rate;
        USDT_rate = usdt_rate;
        _wallet = wallet;
        token = icotoken;
    }

    function setUSDTToken(IERC20 token_address) public onlyOwner {
        require(
            address(token_address) != address(0),
            "Token cannot be zero address"
        );
        usdtToken = token_address;
        emit SetUSDTToken(token_address);
    }

    function setETHRate(uint256 new_rate) public onlyOwner {
        require(new_rate > 0, "Rate must be greater than 0");
        ETH_rate = new_rate;
        emit SetETHRate(new_rate);
    }

    function setUSDTRate(uint256 new_rate) public onlyOwner {
        require(new_rate > 0, "Rate must be greater than 0");
        USDT_rate = new_rate;
        emit SetUSDTRate(new_rate);
    }

    function buyTokenByETH() external payable {
        uint256 ethAmount = msg.value;
        uint256 amount = getTokenAmountETH(ethAmount);
        require(amount > 0, "Amount is zero"); // số lượng token phải lớn hơn 0
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient account balance"
        ); // số lượng token trong hợp đồng phải lớn hơn số lượng token mà người dùng cần mua
        require(
            msg.sender.balance >= ethAmount,
            "Insufficient account balance"
        ); // số lượng ETH trong tài khoản người dùng phải lớn hơn số lượng ETH người dùng phải trả

        payable(_wallet).transfer(ethAmount); // chuyển ETH sang địa chỉ nhận
        SafeERC20.safeTransfer(token, msg.sender, amount); // chuyển token sang tài khoản người mua
        emit BuyTokenByETH(msg.sender, amount);
    }

    function buyTokenByUSDT(uint256 USDTAmount) external {
        uint256 amount = getTokenAmountUSDT(USDTAmount); // tính số lượng token mà người dùng cần mua
        require(amount > 0, "Amount is zero"); // số lượng token phải lớn hơn 0
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient account balance"
        ); // số lượng token trong hợp đồng phải lớn hơn số lượng token mà người dùng cần mua
        require(
            usdtToken.balanceOf(msg.sender) >= USDTAmount,
            "Insufficient account balance"
        ); // số lượng USDT trong tài khoản người dùng phải lớn hơn số lượng ETH người dùng phải trả

        require(
            usdtToken.allowance(msg.sender, address(this)) >= USDTAmount,
            "Need to approve USDT first"
        ); // người dùng phải approve token trước khi mua

        SafeERC20.safeTransferFrom(usdtToken, msg.sender, _wallet, USDTAmount);
        SafeERC20.safeTransfer(token, msg.sender, amount);
        emit BuyTokenByUSDT(msg.sender, amount);
    }

    function getTokenAmountETH(
        uint256 ETHAmount
    ) public view returns (uint256) {
        require(ETHAmount > 0, "ETH amount must be greater than 0");
        uint256 amount = ETHAmount * ETH_rate;
        require(amount / ETH_rate == ETHAmount, "Multiplication overflow");
        return amount;
    }

    function getTokenAmountUSDT(
        uint256 USDTAmount
    ) public view returns (uint256) {
        require(USDTAmount > 0, "USDT amount must be greater than 0");
        uint256 amount = USDTAmount * USDT_rate;
        require(amount / USDT_rate == USDTAmount, "Multiplication overflow");
        return amount;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
        emit WithdrawETH(msg.sender, balance);
    }

    function withdrawErc20() public onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        usdtToken.transfer(msg.sender, balance);
        emit WithdrawERC20(msg.sender, balance);
    }
}
