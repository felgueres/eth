Multisignature wallet is an account that requires m-of-n quorum of approved private keys to approve a transaction before it is executed. 

In eth, multisig wallets are implemented as a smart contract, where each approved external account sends a transaction in order to "sign" a transaction collectively.

This is for learning purposes, for a deeply audited check out the (Gnosis multisig wallet)[https://wallet.gnosis.pm/#/wallets].

Learning Objectives:

1. Handle complexity between multiple users on one contract.
2. Learn how to avoid loops and implement voting logic.
3. Learn to assess possible attacks on contracts. 

Requirements

1. Contract has multiple owners
2. Owners determine which transactions the contract is allowed to execute
3. Owners need to be to propose Txs that other owners can either confirm or revoke
4. If proposed transaction gets enough support, it'll be executed


