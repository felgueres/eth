sha256 = require('js-sha256');

function searchForBlock(transactionRoot, prevBlockHash, difficulty, nonce){
  let block = {txRoot: transactionRoot, prevBlockHash: prevBlockHash, nonce: nonce}

  let blockHash = sha256(JSON.stringify(block))
  console.log("blockHash:" + blockHash + " nonce:" + nonce)
	
}

searchForBlock('a', 'b', 1, 1)
