const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const sendValue = ethers.utils.parseEther("0.01");
  const deployer = (await getNamedAccounts()).deployer;
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Sending fund....");
  const transactionResponse = await fundMe.fund({ value: sendValue });
  await transactionResponse.wait(1);
  console.log("Funded!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
