sha256 = require('js-sha256');

function searchForBlock(transactionRoot, prevBlockHash, difficulty, nonce){
  // tx: transaction

  let block = {txRoot: transactionRoot, prevBlockHash: prevBlockHash, nonce: nonce}

  let blockHash = sha256(JSON.stringify(block))

  console.log("blockHash:" + blockHash + " nonce:" + nonce)
  
  let measureOfDifficulty = "0".repeat(difficulty)  // returns 000 if difficulty is 3

  if(blockHash.startsWith(measureOfDifficulty)){
  
  return block
  } else {
  
  return searchForBlock(transactionRoot, prevBlockHash, difficulty, nonce + 1)
  
  }
	
}

genesisBlock = {
  timestamp: 1615444357504,
  difficulty: 4,
  networkID: 1111
}

hashGenesisBlock = sha256(JSON.stringify(genesisBlock))
transactionRoot = sha256("Howard Roark") // IRL this would be the the Merket Root of the transaction tree
zero_nonce = 0 // This could be any number but let's start with 0
difficulty = 3 // Increase this value it doesn't 

// Find First Block
// You are searching nonce that creates the  hash that matches the difficulty

firstBlock = searchForBlock(transactionRoot, hashGenesisBlock, difficulty, zero_nonce) 
hashFirstBlock = sha256(JSON.stringify(firstBlock))

// Find Second Block given with new transactions and first Block
transactionRoot2 = sha256(JSON.stringify("New Transactions"))
secondBlock = searchForBlock(transactionRoot2, hashFirstBlock, difficulty, zero_nonce)

console.log(secondBlock)
