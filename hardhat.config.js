require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("dotenv").config();
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    },
  },

  gasReporter: {
    enabled: true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    curreny: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },

  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
