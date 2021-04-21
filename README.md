```
TODO & Resources
* Investigate the relative merits of proof of work vs. proof of stake
* How is hash computed? What is nonce?
* First-to-file paradigm? First registerer succeeds, seconds fails.
* Check out merkel trees (P1)
* Elliptic curve signature as input for public keys
* Have a good understanding of virtual machines
* Read sci-fi: Mirrorshades
* How many transactions a second rn for Eth?
* Real-time monitoring of Eth Blockchain and block creation: http://ethviewer.live/
* Rewatch Eth Mining: Not clear 
* Video: Hashing Algorithms and Security by Computerphile
* Vis representation of blockchain: https://andersbrownworth.com/blockchain/
* Building on blockchain (https://blog.ycombinator.com/building-for-the-blockchain/)

Byzantine fault: https://en.wikipedia.org/wiki/Byzantine_fault#Byzantine_Generals'_Problem

```

Eth: Blockchain with Turing-complete programming language used to create contracts to encode arbitrary state transition functions.

Enables: Creating systems by writing logic.

Turing Complete: Data Manipulation rules (code) is said to be computationally universal if it can be used to simulate any turing machine.

#### HISTORY

First attempts of decentralized consensus:
- b-money (1998)
- Reusable proofs of work (2005)  
  Fell short for relying on trusted computed as backend.

Bitcoin (2009)  
  Combined primitives for managing ownership through public key crypto with consensus algo to keep track of who owns coins. The consensus algo is known as "proof of work".

Proof of work was the breakthrough for:
1) Simple and moderately effective consensus algo allowing nodes in the network to collectively agree on a set of canonical updates to the state of the bitcoin ledger.
2) Provides mechanism for free entry into consensus algorithm, solving the political problem of who gets to influence the consensus while preventing sybil attacks. This is done by substituting a barrier of participation, such as being registered as a unique entity, with an economic barrier. The economic barrier is the weight of a single node in the consensus voting is directly proportional to the computing power that the node brings. 

> Proof of Work: More computing power more voting power.  
> Proof of Stake: More currency holdings more power.

Novelty since then, 'Proof of stake'.
- Instead of calculating the weight of a node as proportional to its currency holdings and not computational resources.

Both approaches are the backbone of a cryptocurrency. 

| approach | merits |
| -------- | ------ |
| work | ... |
| stake | ... |

#### BITCOIN AS A STATE TRANSITION SYSTEM

Inputs: Current state with all holdings

State Transition Function: Take the state and transaction

Outputs: New State

eg. in traditional banking: 

Initial State: Balance Sheet
Transaction: Request to move holdings from A to B. 
Function: Reduce in A by X and increase value in B given A > X.

```
APPLY(S, TX) -> S' or Error

where:
-  S is the State (balance sheet in this example)
-  TX is the transition function 

APPLY({Alice: 50, Bob: 50}, "Send 20 from Alice to Bob") -> {Alice: 30, Bob: 70}

```
In Bitcoin:
- The state S is the collection of all coins or all unspent transaction outputs, UTXO, which have been mined and not yet spent. Each UTXP has a denomination and an owner. 
- **UTXO** is defined by a 20-byte address which is a crypto key


In a transaction
- A transaction contains >= 1 inputs, each referencing a UTXO and a crypto signature produced by a private key associated with the owners address.
- 1 >= outputs, each containing a new UTXO to be added to the state.

The state transition function

```
APPLY(S,TX) -> S'

- 1. For each input in TX
- if refenced UTXO is not in S, return error. **PREVENTS** transaction senders from spending unexisting coins. 
- if provided signature does not match owner of UTXO, return error. **PREVENTS** senders from spendeing other people's coins. 

- 2. If sum of denominations of all input UTXO is less than the sum of the denominations of all output UTXO, return an error. **ENFORCES** conservation of value.

- 3. Return S' with all input UTXO removed and all output UTXO added.
```

Example of this protocol, Alice wants to send Bob 11.7 BTC (Alice is a rich bitch in 2021).  

INPUTS  
- Alice looks for a set of available UTXO she owns worth at least 11.7
- Say the smallest she can get is 6+4+2=12  

TRANSITION FUNCTION  
- Alice CREATES a transaction with those 3 inputs and 2 outputs.  

OUTPUTS   
- 11.7BTC with Bob's address as its owner
- 0.3BTC in change for Alice herself as owner

---

#### MINING

Implementing this transaction system on a centralized computer is trivial. Centralized not good, so.

On one hand you need the **state transition system** and in the other a **consensus system** that ensures everyone agrees on the order of transactions.

The decentralized consensus process requires nodes in the network to continuously attempt to produce packages of transactions called **blocks**.

Proporties of blocks:
  * Roughly network produces one every 10 minutes
  * Timestamp
  * Nonce ("number used once")
  * Reference to the previous block (ie. hash of)
  * List of all the transactions that happened since the previous block

Over time this creates a persistent, ever-growing, chain of blocks that constantly update to represent the latest state of the ledger.

```
ALGORITHM TO VALIDATE ONE BLOCK

1. Check if previous block is referenced by the block exists and is valid2. Check that the ts of the block is greater than that of the previous blocks and less than 2 hours into the future
3. Check that the proof of work on the block is valid.
4. Let S[0] be the state at the end of the previous block.
5. Suppose TX is the block's transaction list with n transactions. For all i in 0...n-1, set S[i+1] = APPLY(S[i],TX[i]). If any application returns an error, exit and return false.
6. Return true, and register S[n] as the state at the end of this block.

NOTES:
    * State is not encoded in the block in any way. It's an abstraction. It can only be computed for any block by starting from the genesis state and sequentially apply every transaction in every block.
    * The order in which the miner includes transactions into the block matters; if there are two transactions A and B in a block such that B spends a UTXO created by A, the block will be valid if A comes before B but not otherwise.
```

ON PROOF OF WORK   

    * Precisely, double-SHA256 hash of every block, treated as 256-bit number, must be less than a **dynamically adjusted target**, which is 2^187 at time of writing.
    * The motivation of this is to make blocks computationally **hard** to avoid attakers from remaking the entire blockchain in their favor.  

**SHA256**: Designed to be a completely unpredictable pseudorandom function, the only way to create a valid block is simply trial and error, repeatedly incrementing the nonce and seeing if the new hash matches.

The network makes an average ~2^69 tries before a valid block is found.
Every 2016 the network recalibrates so that some node in the network can produce a block every ten minutes or so.

To compensate miners: 
- Miner of every block **is entitled to include a transaction giving themselves 12.5BTC out of nowhere.** 
- Additionally, if any transaction has a higher total denomination in its inputs than in its outputs, the difference also goes to the miner as a transaction fee.
- Bitcoin in the genesis state has no coins at all.

**A full node in the bitcoin network, one that stores and processes the entirety of every block, takes up about 15GB of disk space in the Bitcoin Network as of April 2014, growing by 1GB/month.**

A protoco known as "Simplified Payment Verification" (SPV) allows for another class of nodes to exist, called "light nodes", which download block headers, verify proof of work on the headers, and then download only the branches associated with transactions that are relevant to them. This allows light nodes to determine with a strong guarantee of security what the status of any Bitcoin transaction, and their current balance, is while downloading only a very small portion of the entire blockchain.

---

#### Alternative Blockchain Applications

Nick Szabo (1998): Secure property titlees with owner authority
Metacoins: Protocol living ontop of bitcoin, using bitcoin transactions to store metacoin transactions but having different state transition function.

There's 2 approaches towards building a consensus protocol:
1. Building an independent network: Vast majority of apps would be too small to warrant their own blockchain.
2. Building a protocol atop bitcoin: Not flexible to handle new protocols' logic. 

> Bitcoin facilitates a weak version of smart contracts.

--- 

### SCRIPTING

Bitcoin limitations and need for Eth.
- Lack of Turing-Completeness: Doesn't have loops.
- Value-Blindness: UTXO are all-or-nothing, there's no fine-grained control over amount to be withdrawn. 
- Lack of State: UTXO can either be spent or unspent, there's no multi-stage contract ability.
- Blockchain-blindness: UTXO is blind to blockchain data such as the nonce, ts or previous block hash. These could be useful as sources of randomness.

Building eth then is in favor of unlimited freedom in building a feature set at the expense of development time, bootstrapping effort and security.

----

### ETHEREUM ACCOUNTS

* The state is made of objects called "accounts". Each having a 20-byte address and state transitions being direct transfers of value and information between accounts.

Ethereum Accounts contain 4 fields:
* **Nonce**: A Counter used to ensure each transaction can only be processed once.
* Account's current ether balance
* Account's contract code, if present
* Account's storage, if present, empty by default

There are 2 type of accounts:
1. Externally owned accounts. Controlled by private keys.  
   These have no code. One can send messages from an externally owned account by creating and signing a transaction.
2. Contract Accounts. Controlled by their contract code.  
   Every time the contract account receives a message its code activates, allowing it to read and write to internal storage and send other messages or create contrats in return.

```
**CONTRACTS** in ethereum should not necesarily be fulfilled or complied with. They are more like **autonomous agents** that live inside of ethereum execution environment, always executing a specific piece of code when "poked" by a message or transaction, and having direct control over their own ether baalnce and their own key/value store to keep track of persistent variables.
```
---

#### TRANSACTIONS

A transaction refers to the signed data package that stores a message to be sent from an externally owned account. 
A transaction updates the state; balance or storage.

They contain:
1. Recepient of the message
2. A signature identifying the sender
3. Amount of ether to transfer from the sender to the recipient
4. Optional field: Doesn't have a function by default but the virtual machine can make it available to a contract for its use. 
5. ```STARTGAS``` value representing the max number of computational steps the transaction execution is allowed to take.  
6. ```GASPRICE``` value representing the fee the sender pays per computational step

Example of Optional field. Let's say you have a service that registers domains on the blockchain. A contract functions as the service. It would interpret the data being passsed to it as containing two "fields", first field being domain to register and second the IP address to register to.
Contract would read values from the message data and place them in storage.

NOTE: ```STARTGAS and GASPRICE``` guarantee anti-denial service model.
In order to prevent computational wastage in code, each transaction is required to set a limit to how computational steps of code execution it can use. 

- **GAS is the fundamental unit of computation.**
- A computational step costs 1 gas.
- Some operations cost higher gas because they are more expensive or increase the amount of data that must be stored as part of the state.
- Also, there is a **GAS FEE OF 5 for every byte in transaction data**. The motivation is to require an attacker to pay proportionally for every resource that they consume, including compute, bandwidth and storage.  

**PAY GAS FOR COMPUTE, STORAGE AND BANDWIDTH**

#### MESSAGES

* Contracts can send messages to other contracts.
* Messages are virtual objects that are never serialized and exist only in the ETH exeuction environment.

A message contains the following:
1. Sender of the message (implicit)
2. Recipient of the message
3. Amount of ether to transfer alongside the message
4. Optional field
5. ```STARTGAS``` value  

**Essentially messages are like transactions except they are produced by a contract and not an external actor.**

A message is produced when a contract currently executing code executes ```CALL``` opcode, which produces and executes a message. 

Like a transaction, a message leads to the receipient account running its code.

**In this way, contracts can have relationships with other contracts exactly the same as external actors can**.

---

#### ETHEREUM STATE TRANSITION FUNCTION

See example https://ethereum.org/en/whitepaper/ for details. 

- There is an opcode ```CREATE``` which creates a contract; it is similar in execution mechanics than ```CALL``` with the exception that the output of the execution determines the code of a newly created contract.

#### CODE EXECUTION

- Code consists of bytes where each represents an operation.
- Code executes as an infinite loop consisting of carrying out the operation at current program counter beginning at zero, incrementing program counter by one until ```STOP``` or ```RETURN``` instruction is detected.

Operations have access to:
1. **Stack**. Last-in-first-out container to which values can be pushed or popped. Reset after computation ends.
2. **Memory**. Infinitely expandable byte array. Resets after computation ends.
3. **Contract's long-term storage** as a key/value store. Doesn't reset after computation ends. 

When EVM is running, the full computational state can be defined by the following tuple. 

```(block_state, transaction, message, code, memroy, stack, pc, gas)```

Where:  
- ```block_state```. Global state containing all accounts and includes balances and storage. At start of every round execution, current instruction is found by taking the ```pc-th``` byte of code (or 0 if ```pc >= len(code))```, and each instruction has its own definition in terms of how it affects the tuple. 

```ADD``` pops two items off the stack and pushes their sum, reduces ```gas``` by 1 and increments ```pc``` by 1.  

```SSTORE``` pops the top two items off the stack and inserts the second item into the contract's storage at the index specified by the first item


---

#### Operational Understanding of the Blockchain  

1. Like a database and like a network fused into one (merged)

- In a network based system, no connectivity between dbs, costs of moving things around
- Single shared story of reality stored in all computers
- The first try of the technology was to reinvent gold.
- Government is a popularity contest, pick person most likeable although we don't know nothing about them. Assemble them to decide what we do and don't everyday? wtf
- Consitituted by the will of the people and serves their purposes which should be the original intention of government.
- Unification of systems, reduction of costs will eventually come by removing network costs, latency, etc.
- If you want mental models of what's happening with blockchain today, you need to read cyberpunk sci-fi. 2Mirrorshades.

2. We can all run code, it's deterministic. 

---

#### Consensus MEchanisms

1. Practical Byzantine Fault Tolerant
2. Proof of Work: Block hash must be less than target number (difficulty)
- Miners guess and check hashes
- Broadcast solution to the network
- Solution contains reward for miner

It's basically a competition for the reward
- Who can find a valid block hash first 

3. Proof of Stake: Currency stakeholders stake some currency for the chance to determine a bloc
- block validator randomly selected by network
- Enables higher transaction rates on public blockchains

---

#### Hash Functions

Properties of hashfunctions

1. Deterministic (that's why they are pseudorandom and not fully random)
2. Fast
3. Infeeasible to reverse (analogy is to merge some paint together and try to reverse to original colors)
4. Small change in input results in very different output
5. Collision resistent (No two different data produces same hash)
6. Output fix typed length regardless of input.

They are typically chained together for data validity

Examples of hash functions: SHA256 & keccak256

```
i: sha256("")
o: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

sometimes you can do: 

threeHash = keccak256(sha256("hello")+sha256("world"))

```

---

#### Public Key Cryptography

Inputs: Random Data

Process: Key Generation Algo (elliptic curve for Eth) 

Outputs: Master Private Keys (these have surrogate private keys)

Enables: 

1. Encryption: Only private key holder can decrypt a ameesage with public key
2. Authentication: A public key can verify ownership of a private key. Also, sign transactions on chain.

---

#### Merkle Trees
  Leaves are hashes of data
  Every node is a hash of two child leaves 
  You can verify auth of tree with node
  For dataset size n verification requires log(n) -- Scalability

Eth uses properties of Merkle and Patricia Trees  
  
https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/
https://observablehq.com/@consensys-academy/merkle-trees

---

#### On Gas
Gas is the metering unit of the EVM
Each operation on the EVM consumes gas, depending on the operation.
- Multiplication consumes 5 gas
- Addition consumes 3 gas

Gas is paid with Eth.
Gas limit and price is specified per transaction.
Gas limit is max gas allowed per transaction.
The marketplace for gas fluctuates from demand.

The gas cost of a transaction can be estimated before it's sent.
The amount to send with transaction is the start gas or gas limit.
Gas is reduced on every operational step so you can run out of gas during exeuction.
If you run out of gas in a transaction, the remaining steps will fail.
Any remaining gas in the transaction will be returned to the sender.

why gas? reduce spam, halt bad code, every op costs something. alignment of incentives.

---

### Intuition on how ethereum works
1. Transactions are broadcasted by users
2. Miners observe this transactions and race to include them in a block
3. They compute a valid network state by applying the transaction they've included in a block. 
4. When a miner finds a valid block hash, the transaction data and block header is packaged into a block.
5. When a miner finds a valid block hash, the block is broadcasted with: Transaction list, uncles list, block header (previous block hash, state root, transactions root, receipt root, block number, gas used, timestamp, nonce)

### Other Whys?
1. In the current internet, the user entrusts 3rd parties and organizations with their data
2. Auditability due to immutability.

### dApps Development
- Web 2.0 Apps (client-server apps) happens in servers, information is stored in databases, service layer is made of http API 
- Web 3 dApps happens in a p2p network, ie. they are hosted in distributed networks, information is stored in blockchain or other decentralized networks, the service layer is built on p2p protocols
- Sample architechture: web3 enabled browser <--> (http/s) --> html <--> (RPC) <--> ETH node gateway <--> (DEVP2P to Network)

### Capturing Value  
The paradigm shift is to go from fat application layers to store and monetize users data to thin application layers where the communication protocal captures the value, ie. fat protocols and thin app layer. You monetize the protocol as users build businesses on top of the protocol. Protocol creators issue tokens to represent the value of the protocol.

In this paradigm, open data wins for all, and incentives are aligned to prevent "winner-take-all" markets.

