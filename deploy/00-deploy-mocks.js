const { network } = require("hardhat");
const {
  DECIMALS,
  INITIAL_NUMBER,
  networkConfig,
  developerChain,
} = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developerChain.includes(network.name)) {
    log("Deploying mocks......");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_NUMBER],
    });
    log("Deployed mocks!!");
    log("---------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
