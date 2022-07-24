const { network } = require("hardhat");
const { networkConfig, developerChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if (developerChain.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  log("Deploying contract....");

  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("Deployed contract!!!!");
  if (!developerChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args);
  }
  log("-----------------------------------");
};

module.exports.tags = ["all", "fundMe"];
