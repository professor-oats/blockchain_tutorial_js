// Part 1: Create the blockchain

// Part 2: We will also need to add a proof-of-work so you just can't create new blockchain on the go and make a remade version of another blockchain

// We will have to set a 'difficulty' so the coin will take a while for a processor to be computed. Bitcoins' aim is to have a 10 minutes duration for every creation of a new block.

// Proof-of-work is therefore a measurement of computing power to make a block

// Part 3: Introduce crypto currency to the blockchain. We will make it so a block can contain multiple transaction and also add a reward for mining

// Transaction made between the creation of a new block is stored in pending transaction arrays that can be included in the new block

class Transaction {
    constructor(fromAddress, toAddress, amount) {
	this.fromAddress = fromAddress;
	this.toAddress = toAddress;
	this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
	this.timestamp = timestamp;
	this.transactions = transactions;
	this.previousHash = previousHash;
	this.hash = this.calculateHash();
	this.nonce = 0;
    }

    calculateHash() {
	var hash1 = CryptoJS.SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions + this.nonce)).toString();
	return hash1;
    }

    mineBlock(difficulty) {    // Mining is proof-of-work
	while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {    // Take the first 'difficuly amount' of characters of our hash and make 0:s of it;
	    this.nonce++;
	    this.hash = this.calculateHash();
	}

	console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
	this.chain = [this.createGenesisBlock()];
	this.difficulty = 2;
	this.pendingTransactions = [];
	this.miningReward = 100;
    }

    createGenesisBlock() {
	return new Block("01/11/2021", "Genesis block", "0");
    }

    getLatestBlock() {
	return this.chain[this.chain.length - 1];    // The chain is array of all the blocks whereat this.chain.length - 1 gives us the position of the last block
    }

/*    addBlock(newBlock) {
	newBlock.previousHash = this.getLatestBlock().hash;    // When adding new block the previous hash must be the same as the hash of the latest block for the new block to be valid
	newBlock.mineBlock(this.difficulty);    // Create a hash for this block
	this.chain.push(newBlock);
    }
*/

    minePendingTransactions(miningRewardAddress) {
	let block = new Block(Date.now(), this.pendingTransactions);    // Including all pending transactions in the new block. This works only because we have an easy and small blockchain. In reality you have to code the miner so it picks what transactions to store in new block.

	block.mineBlock(this.difficulty);
	
	console.log('Block successfully mined!');
	this.chain.push(block);    // Pushing the new block to the chain

	this.pendingTransactions = [
	    new Transaction(null, miningRewardAddress, this.miningReward)
	];    // Clear the pending transaction by defining a new transaction. The fromAdress is 'null' in this case since we have no fromAdress here when miners generate the new block. Send it to miningRewardAdress and the amount this.miningReward

    }

    createTransaction(transaction) {
	this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
	let balance = 0;

	for(const block of this.chain) {    // Loop over all blocks in the chain
	    for(const trans of block.transactions) {    // Loop over all transactions in the block
		if(trans.fromAddress === address) {
		    balance -= trans.amount;
		}

		if(trans.toAddress === address) {
		    balance += trans.amount;
		}
	    }
	}

	return balance;
    }
	

    isChainValid() {
	for(let i = 1; i < this.chain.length; i++) {
	    const currentBlock = this.chain[i];
	    const previousBlock = this.chain[i - 1];

	    if(currentBlock.hash !== currentBlock.calculateHash()) {
		return false;
	    }

	    if(currentBlock.previousHash !== previousBlock.hash) {
		return false;
	    }
	}

	return true;    // If everything good and no errors: return true
    }

}

let savjeeCoin = new Blockchain();

savjeeCoin.createTransaction(new Transaction('address1', 'address2', 100));
savjeeCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\nStarting the miner...');
savjeeCoin.minePendingTransactions('xaviers-address');    // Mining after the transactions to create the new amount/new coins

console.log('\nBalance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));

console.log('\nStarting the miner again...');
savjeeCoin.minePendingTransactions('xaviers-address');    // Mining after the transactions to create the new amount/new coins

console.log('\nBalance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));
