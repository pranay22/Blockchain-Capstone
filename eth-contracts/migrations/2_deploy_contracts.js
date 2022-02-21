// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721MintableComplete = artifacts.require("ERC721Mintable");

module.exports = function(deployer) {
  deployer.deploy(ERC721MintableComplete, "Udacity Property Coin Pranay", "UPCP");
  deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier, "Udacity Property Coin Pranay", "UPCP");
};