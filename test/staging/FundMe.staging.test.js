const { assert } = require("chai");
const { ethers, getNamedAccounts } = require("hardhat");

const { developerChain } = require("../../helper-hardhat-config");

developerChain.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther("0.01");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });
      it("allow people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withDraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
