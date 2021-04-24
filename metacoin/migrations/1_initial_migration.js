// Migrations files grab data from the artifacts which are the contract json files after compile in build folder
// Migration scripts export a function with module.export syntax, function accepts deployer object as first param
// Deployer object is the main interface for staging deployment tests
// Truffle requires a Migration contract to use this feature

const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
