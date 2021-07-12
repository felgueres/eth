# NFT Swapper
## Overview
With the recent NFT boom, lots of people have NFT's, and want to trade them amongst each other. But they want to do this trustlessly. No intermediaries, and no platforms. So we're going to build a smart contract to help them out. At it's core, this contract will allow:

- Proposing a particular swap, indicating which NFT they're willing to trade for.
- Executing an atomic swap, if all the conditions are met.

## Features 
1.) Enable two Token users to propose swapping their tokens.
 
2.) The owner proposing to swap can propose an optional payment.

3.) The owner can also add an **expiration time** onto the Swap.
 
## Helpful Context
* NFT's are managed through their own smart contracts. Internally those contracts keep track of who owns what with some simple mappings.
* So "swapping" NFT's between people really just means atomically updating the mapping in one NFT contracts from one owner to the other (and then vice versa in the other NFT contract).
* So our `Swapper` contract doesnt' actually "hold" any NFT's itself. 
* Our Swapper contract is assuming to be interacting with what's known as an ERC-721, which is the NFT standard. And we're specifically interacting with a [standard implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) written by OpenZeppelin, in case you need to check it out.

## Installing
- `npm install`

## Running Tests
- `npm test`
