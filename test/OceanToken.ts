import { expect } from "chai";
import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("OceanToken contract", function () {
    // global variables
    let Token: any;
    let oceanToken: any;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let addr2: HardhatEthersSigner;
    let TokenCap: number = 100000000;
    let tokenBlockReward: number = 50;

    beforeEach(async () => {
        [owner, addr1, addr2] = await hre.ethers.getSigners(); // lấy các account để deploy contract (ethers sẽ tự động tạo 20 account với private key)
        
        // Lấy contract factory
        Token = await hre.ethers.getContractFactory("OceanToken");
        
        // Deploy contract với các parameters nếu cần
        oceanToken = await Token.deploy(TokenCap, tokenBlockReward);
        
        // Đợi contract được deploy hoàn toàn
        await oceanToken.waitForDeployment();
    });

    describe("Deployment", () => {

        // Kiểm tra owner của contract
        it("Should set the right owner", async () => {
            expect(await oceanToken.getOwner()).to.equal(owner.address);
        });

        // kiểm tra rằng toàn bộ token được mint ra lúc deploy đều thuộc về chủ sở hữu
        it("Should mint the right amount of tokens", async () => {
            const ownerBalance = await oceanToken.balanceOf(owner.address);
            const initSupply = await oceanToken.totalSupply();
            expect(ownerBalance).to.equal(initSupply);
        });

        // Kiểm tra rằng giới hạn tổng cung (max supply)
        it("Should set the max total supply", async () => {
            const cap = await oceanToken.cap();
            const capInEther = Number(hre.ethers.formatEther(cap)); // Qua hre để chuyển đổi từ wei sang ether
            expect(capInEther).to.equal(TokenCap);
        });

        // Kiểm tra biến blockReward có đc gán đúng giá trị ko
        it("Should set the block reward", async () => {
            const blockReward = await oceanToken.blockReward();
            const blockRewardInEther = Number(hre.ethers.formatEther(blockReward));
            expect(blockRewardInEther).to.equal(tokenBlockReward);
        });
    });

    describe("Minting", () => {
        // kiểm tra việc chuyển token giữa các account
        it("Should transfer tokens between accounts", async () => {
            // chuyển cho addrr1 50 token
            await oceanToken.transfer(addr1.address, 50);
            const addr1Balance = await oceanToken.balanceOf(addr1);
            expect(addr1Balance).to.equal(50);

            // addr1 chuyển cho addr2 50 token
            await oceanToken.connect(addr1).transfer(addr2.address, 50);
            expect(await oceanToken.balanceOf(addr2.address)).to.equal(50);
        });

        // kiểm tra việc chuyển token giữa các account
        it("Should fail if sender doesn't have enough tokens", async () => {
            const ownerBalance = await oceanToken.balanceOf(owner.address);
            await expect(oceanToken.connect(addr1).transfer(addr2, 500)).to.be.revertedWithCustomError(
                oceanToken,
                "ERC20InsufficientBalance"
              );
            expect(await oceanToken.balanceOf(owner.address)).to.equal(ownerBalance);
            expect(await oceanToken.balanceOf(addr2.address)).to.equal(0);

        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await oceanToken.balanceOf(owner.address);
      
            // Transfer 100 tokens from owner to addr1.
            await oceanToken.transfer(addr1.address, 100);
      
            // Transfer another 50 tokens from owner to addr2.
            await oceanToken.transfer(addr2.address, 50);
      
            // Check balances.
            const finalOwnerBalance = await oceanToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);
      
            const addr1Balance = await oceanToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
      
            const addr2Balance = await oceanToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
          });
    });
});
