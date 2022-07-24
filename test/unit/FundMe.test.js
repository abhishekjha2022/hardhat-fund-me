const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { developerChain } = require("../../helper-hardhat-config");

!developerChain.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe;
      let mockV3Aggregator;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        await deployments.fixture(["all"]);
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("Constructor", async function () {
        it("Should set the constructor arguments properly", async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });
      describe("fund", async function () {
        it("Should fail if didn't send enough ETH", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "Insufficient amount to fund!"
          );
        });
        it("Adds the funder to the array", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getFunders(0);
          assert.equal(response, deployer);
        });
        it("Updates the data of funders", async function () {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
      });
      describe("WithDraw", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });
        it("Withdraw the fund from a single funder", async function () {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.withDraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { effectiveGasPrice, gasUsed } = transactionReceipt;

          const gasCost = effectiveGasPrice.mul(gasUsed);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalace).toString(),
            endingDeployerBalace.add(gasCost).toString()
          );
        });
        it("allow to withdraw funds from multiple funders", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 6; i++) {
            const connectFunders = await fundMe.connect(accounts[i]);
            await connectFunders.fund({ value: sendValue });
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.withDraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { effectiveGasPrice, gasUsed } = transactionReceipt;

          const gasCost = effectiveGasPrice.mul(gasUsed);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalace).toString(),
            endingDeployerBalace.add(gasCost).toString()
          );
          await expect(fundMe.getFunders(0)).to.be.reverted;
          for (i = 0; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
        it("Only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const fundMeConnectedContract = await fundMe.connect(accounts[1]);
          await expect(fundMeConnectedContract.withDraw()).to.be.reverted;
        });
        it(" cheaper Withdraw the fund from a single funder", async function () {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.cheaperWithDraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { effectiveGasPrice, gasUsed } = transactionReceipt;

          const gasCost = effectiveGasPrice.mul(gasUsed);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalace).toString(),
            endingDeployerBalace.add(gasCost).toString()
          );
        });
        it("cheaper withdraw testing....", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 6; i++) {
            const connectFunders = await fundMe.connect(accounts[i]);
            await connectFunders.fund({ value: sendValue });
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          const transactionResponse = await fundMe.cheaperWithDraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { effectiveGasPrice, gasUsed } = transactionReceipt;

          const gasCost = effectiveGasPrice.mul(gasUsed);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalace = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalace).toString(),
            endingDeployerBalace.add(gasCost).toString()
          );
          await expect(fundMe.getFunders(0)).to.be.reverted;
          for (i = 0; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
      });
    });
