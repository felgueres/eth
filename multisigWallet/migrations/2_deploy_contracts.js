var Multisig = artifacts.require("MultiSignatureWallet")
var SimpleStorage = artifacts.require("SimpleStorage")

module.exports = function(deployer, network, accounts) {

    const owners = [accounts[0], accounts[1]]

    deployer.deploy(SimpleStorage)
    deployer.deploy(Multisig, owners, 2)
};
