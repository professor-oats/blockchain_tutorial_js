// We will also need to add a proof-of-work so you just can't create new blockchain on the go and make a remade version of another blockchain

// We will have to set a 'difficulty' so the coin will take a while for a processor to be computed. Bitcoins' aim is to have a 10 minutes duration for every creation of a new block.

// Proof-of-work is therefore a measurement of computing power to make a block

class Block {
    constructor(index, timestamp, data, previousHash = '') {
	this.index = index;
	this.timestamp = timestamp;
	this.data = data;
	this.previousHash = previousHash;
	this.hash = this.calculateHash();
	this.nonce = 0;
    }

    calculateHash() {
	var hash1 = CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data + this.nonce)).toString();
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
	this.difficulty = 4;
    }

    createGenesisBlock() {
	return new Block(0, "01/11/2021", "Genesis block", "0");
    }

    getLatestBlock() {
	return this.chain[this.chain.length - 1];    // The chain is array of all the blocks whereat this.chain.length - 1 gives us the position of the last block
    }

    addBlock(newBlock) {
	newBlock.previousHash = this.getLatestBlock().hash;    // When adding new block the previous hash must be the same as the hash of the latest block for the new block to be valid
	newBlock.mineBlock(this.difficulty);    // Create a hash for this block
	this.chain.push(newBlock);
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

console.log('Mining block 1...');
savjeeCoin.addBlock(new Block(1, "10/11/2021", { amount: 4 }));
console.log('Mining block 2...');
savjeeCoin.addBlock(new Block(2, "12/11/2021", { amount: 10 }));


