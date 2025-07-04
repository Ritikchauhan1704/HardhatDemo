import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { Token, Token__factory } from "../typechain-types";

describe("Token contract", () => {
  let hardhatToken: any;
  let TokenFactory: Token__factory;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addrs: Signer[];

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    TokenFactory = (await ethers.getContractFactory("Token")) as Token__factory;
    hardhatToken = await TokenFactory.deploy();
   
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await hardhatToken.owner()).to.equal(await owner.getAddress());
    });

    it("Deployment should assign the total supply to the owner", async () => {
      const ownerAddress = await owner.getAddress();
      const ownerBalance = await hardhatToken.balanceOf(ownerAddress);
      const totalSupply = await hardhatToken.totalSupply();

      expect(ownerBalance).to.equal(totalSupply);
    });
  });

  describe("Transaction", () => {
    it("Should transfer tokens between accounts", async () => {
      const addr1Address = await addr1.getAddress();
      const addr2Address = await addr2.getAddress();

      await hardhatToken.transfer(addr1Address, 10);
      expect(await hardhatToken.balanceOf(addr1Address)).to.equal(10);

      await hardhatToken.connect(addr1).transfer(addr2Address, 5);
      expect(await hardhatToken.balanceOf(addr2Address)).to.equal(5);
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const ownerAddress = await owner.getAddress();
      const initialOwnerBalance = await hardhatToken.balanceOf(ownerAddress);

      await expect(
        hardhatToken.connect(addr1).transfer(ownerAddress, 1)
      ).to.be.revertedWith("Not enough tokens");

      expect(await hardhatToken.balanceOf(ownerAddress)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async () => {
      const addr1Address = await addr1.getAddress();
      const addr2Address = await addr2.getAddress();

      await hardhatToken.transfer(addr1Address, 100);
      await hardhatToken.connect(addr1).transfer(addr2Address, 50);

      const finalAddr1Balance = await hardhatToken.balanceOf(addr1Address);
      const finalAddr2Balance = await hardhatToken.balanceOf(addr2Address);

      expect(finalAddr1Balance).to.equal(50);
      expect(finalAddr2Balance).to.equal(50);
    });
  });
});
