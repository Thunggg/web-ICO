import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from '@ethersproject/contracts';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import * as chai from "chai";
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
import { keccak256 } from 'ethers';

describe("Vault", () => {

    let owner: HardhatEthersSigner;
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let token: any;
    let vault: any;

    const INIT_SUPPLY = ethers.parseEther("1000000"); // 1 triệu token
    const MAX_WITHDRAW = ethers.parseEther("500"); // 50 token
    const DEPOSIT_AMOUNT = ethers.parseEther("100");

    beforeEach(async () => {
        // Tạo signer
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy mock ERC20
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        token = await MockERC20.deploy("Test Token", "TT", INIT_SUPPLY);
        await token.waitForDeployment();

        // Deploy vault contract
        vault = await ethers.deployContract("Vault");

        // Set initial variables
        await vault.connect(owner).setToken(token);
        await vault.connect(owner).setMaxWithdrawAmount(MAX_WITHDRAW);
        await vault.connect(owner).setWithdrawEnabled(true);

        //transfer token to user
        await token.transfer(user1.address, ethers.parseEther("1000"));
        await token.transfer(user2.address, ethers.parseEther("1000"));
    });

    describe("Constructor", () => {
        it("Should set deployer as owner", async () => {
            expect(await vault.owner()).to.equal(owner.address);
        });

        it("Should grant DEFAULT_ADMIN_ROLE to deployer", async () => {
            expect(await vault.hasRole(vault.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
        });
    });

    describe("SetToken", () => {
        it("Should emit TokenSet event", async () => {
            const MockERC20 = await ethers.getContractFactory("MockERC20");
            const newToken = await MockERC20.deploy("Test Token", "TT", INIT_SUPPLY);
            
            await expect(vault.connect(owner).setToken(newToken))
                .to.emit(vault, "TokenSet")
                .withArgs(await newToken.getAddress());
        });

        it("Should revert when non-owner tries to set token", async function() {
            await expect(vault.connect(user1).setToken(await token.getAddress()))
                .to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount")
                .withArgs(user1.address);
        });

        it("Should revert when token address is zero", async () => {
            await expect(vault.connect(owner).setToken(ethers.ZeroAddress))
            .to.be.revertedWith("Invalid token address");
        });
    })

    describe("setMaxWithdrawAmount", () => {
        it("Should set max withdraw amount by owner", async function() {
            const newMaxAmount = ethers.parseEther("200");
            
            await expect(vault.connect(owner).setMaxWithdrawAmount(newMaxAmount))
                .to.emit(vault, "MaxWithdrawAmountSet")
                .withArgs(newMaxAmount);
        });

        it("Should revert when non-owner tries to set max withdraw amount", async function() {
            await expect(vault.connect(user1).setMaxWithdrawAmount(MAX_WITHDRAW))
                .to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
        });

        it("Should revert when ownert enter withdraw less than 0", async function() {
            await expect(vault.connect(owner).setMaxWithdrawAmount(0))
                .to.be.revertedWith("Max withdraw will be greather than 0");
        });
    });
    
    describe("Withdraw enable/disable", () => {
        it("Should enable/disable withdraw by owner", async () => {
            await expect(vault.connect(owner).setWithdrawEnabled(true))
            .to.emit(vault, "WithdrawEnabledSet")
            .withArgs(true);

            await expect(vault.connect(owner).setWithdrawEnabled(false))
            .to.emit(vault, "WithdrawEnabledSet")
            .withArgs(false);

        });

        it("Should revert when non-owner tries to change withdraw status", async () => {
            await expect(vault.connect(user1).setWithdrawEnabled(true))
            .to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
        });
    });

    describe("deposit", () => {
        beforeEach(async () => {
            await token.connect(user1).approve(await vault.getAddress(), DEPOSIT_AMOUNT);
        });
        
        it("Should deposit successfully", async () => {
            await expect(vault.connect(user1).deposit(DEPOSIT_AMOUNT))
            .to.emit(vault, "Deposit")
            .withArgs(user1.getAddress(), DEPOSIT_AMOUNT);

            expect(await vault.userBalance(user1.getAddress())).to.equal(DEPOSIT_AMOUNT);
            expect(await vault.totalDeposited()).to.equal(DEPOSIT_AMOUNT);

        });

        it("Should revert when depositing zero amount", async () => {
            await expect(vault.connect(user1).deposit(0))
            .to.be.revertedWith("Amount must be greater than 0");
        });

        it("Should revert when token is not set", async () => {
            const newVault = await ethers.deployContract("Vault");
            await token.connect(user1).approve(await newVault.getAddress(), DEPOSIT_AMOUNT);

            await expect(newVault.connect(user1).deposit(DEPOSIT_AMOUNT))
            .to.be.revertedWith("Token must be set");
        });

        it("Should revert when insufficient allowance", async () => {
            await expect(vault.connect(user1).deposit(DEPOSIT_AMOUNT * 2n))
            .to.be.rejectedWith("Insufficient allowance - please approve tokens first");
        });

        it("Should handle multiple deposits", async function() {
            await vault.connect(user1).deposit(DEPOSIT_AMOUNT);
            
            await token.connect(user1).approve(await vault.getAddress(), DEPOSIT_AMOUNT);
            await vault.connect(user1).deposit(DEPOSIT_AMOUNT);

            expect(await vault.userBalance(user1.address)).to.equal(DEPOSIT_AMOUNT * 2n);
            expect(await vault.totalDeposited()).to.equal(DEPOSIT_AMOUNT * 2n);
        });

        describe("Withdraw", () => {
            beforeEach(async () => {
                await token.connect(user1).approve(await vault.getAddress(), DEPOSIT_AMOUNT);
                await vault.connect(user1).deposit(DEPOSIT_AMOUNT);
            });

            it("Should withdraw successfully", async () => {
                const withdrawAmount = ethers.parseEther("30");

                await expect(vault.connect(user1).withdraw(withdrawAmount))
                .to.emit(vault, "Withdrawal")
                .withArgs(user1.getAddress(), withdrawAmount);

                expect(await vault.userBalance(user1.address)).to.equal(DEPOSIT_AMOUNT - withdrawAmount);
                expect(await vault.totalDeposited()).to.equal(DEPOSIT_AMOUNT - withdrawAmount);
            });

            it("Should revert when withdrawing zero amount", async () => {
                await expect(vault.connect(user1).withdraw(0))
                .to.be.revertedWith("Amount must be greater than 0");
            });

            it("Should revert when withdraw is disabled", async () => {
                await vault.connect(owner).setWithdrawEnabled(false);

                await expect(vault.connect(user1).withdraw(ethers.parseEther("30")))
                .to.be.revertedWith("Withdraw is not enabled");
            });

            it("Should revert when amount exceeds max withdraw", async () => {
                const exceedAmount = MAX_WITHDRAW + 1n;

                await expect(vault.connect(user1).withdraw(exceedAmount))
                .to.be.revertedWith("Amount exceeds max withdraw amount");
            });

            it("Should revert when user has insufficient balance for contract", async function() {
                await expect(vault.connect(user1).withdraw(DEPOSIT_AMOUNT + 1n))
                    .to.be.revertedWith("Insufficient balance");
            });

            it("Should revert when user has insufficient balance for themself", async function() {
                const withdrawAmount = await vault.userBalance(user1.address);
                await expect(vault.connect(user1).withdraw(withdrawAmount + 5n))
                    .to.be.revertedWith("Insufficient balance");
            });
        });

        describe("Emergency Withdraw", () => {
            beforeEach(async function() {
                // Setup: User1 deposits tokens
                await token.connect(user1).approve(await vault.getAddress(), DEPOSIT_AMOUNT);
                await vault.connect(user1).deposit(DEPOSIT_AMOUNT);
            });

            it("Should emergency withdraw successfully by admin", async () => {
                await expect(vault.connect(owner).emergencyWithdraw(user1.address, DEPOSIT_AMOUNT))
                .to.emit(vault, "Withdrawal")
                .withArgs(user1.address, DEPOSIT_AMOUNT);

                expect(await vault.userBalance(user1.address)).to.equal(0);
            });

            it("Should revert when called by non-admin", async () => {
                await expect(vault.connect(user1).emergencyWithdraw(user1.address, DEPOSIT_AMOUNT))
                .to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
            })

            it("Should work even when amount exceeds max withdraw", async () => {
                const withdrawAmount = await vault.userBalance(user1.address);
                await expect(vault.connect(owner).emergencyWithdraw(user1.address, withdrawAmount + 5n))
                .to.be.revertedWith("Insufficient balance");
            });
        });
    });

});