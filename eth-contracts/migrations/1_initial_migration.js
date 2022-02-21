//var Migrations = artifacts.require("./Migrations.sol");
var Migrations = artifacts.require("Migrations");
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
