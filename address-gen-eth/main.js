// To generate an address you do:
// 1. Use a mnemonic (a random sequence of words) as a source of randomness
// 2. Convert mnemonic to seed 
// 3. Convert seed to private key via eth wallet hdkey
// 4. Get public key from private key
// 5. Derive ETH by hashing pubKey, getting last 20 bytes of it with prefix 0x 
// 6. After you sign a transaction, you can recover the eth address from the v,r,s which is the output of the signature.

// USAGE
// npm install
// npm run watch
// npm run reload
// go to localhost:8081
//

const BIP39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey')
const Wallet = require('ethereumjs-wallet') // 
const keccak256 = require('js-sha3').keccak256; // Deriving an eth address from a public key
const EthereumTx = require('ethereumjs-tx') // Sign transactions in the browser

function generateMnemonic(){
    return BIP39.generateMnemonic()
}

function generateSeed(mnemonic){
    return BIP39.mnemonicToSeed(mnemonic)
}

function generatePrivKey(mnemonic){
    const seed = generateSeed(mnemonic)
    console.log('mnemonic: ' + mnemonic + '\n seed: ' + seed) 
    const privateKeyFromSeed = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`).getWallet().getPrivateKey()
    console.log('private key from Seed' + privateKeyFromSeed)
    return privateKeyFromSeed 
}

function derivePubKey(privKey){
    const wallet = Wallet.fromPrivateKey(privKey)    
    console.log('wallet' + wallet)
    return wallet.getPublicKey()
}

function deriveEthAddress(pubKey){
    const address = keccak256(pubKey) // keccak256 hash of  publicKey
    // Get the last 20 bytes of the public key
    return "0x" + address.substring(address.length - 40, address.length)    
}

function signTx(privKey, txData){
    const tx = new EthereumTx(txData)
    tx.sign(privKey)
    return tx
}

function getSignerAddress(signedTx){
    return "0x" + signedTx.getSenderAddress().toString('hex')
}


var mnemonicVue = new Vue({
    el:"#app",
    data: {  
        mnemonic: "",
        privKey: "",
        pubKey: "",
        ETHaddress: "",
        sampleTransaction: {
            nonce: '0x00',
            gasPrice: '0x09184e72a000', 
            gasLimit: '0x2710',
            to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6', 
            value: '0x10', 
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
            chainId: 3
        },
        signedSample: {},
        recoveredAddress: ""
    },
    methods:{
        generateNew: function(){
            this.mnemonic = generateMnemonic()
        },
        signSampleTx: function(){
            this.signedSample = signTx(this.privKey, this.sampleTransaction)
            console.log("signed Sample", this.signedSample)
        }
    },
    watch: {
        mnemonic: function(val){
            this.privKey = generatePrivKey(val)
        },
        privKey: function(val){
            this.pubKey = derivePubKey(val)
        },
        pubKey: function(val){
            this.ETHaddress = deriveEthAddress(val)
            this.recoveredAddress = ""
        },
        signedSample: function(val){
            this.recoveredAddress = getSignerAddress(val)
        }
    }
})
