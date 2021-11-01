class Block {
    constructor(index, timestamp, data, previousHash = '') {
	this.index = index;
	this.timestamp = timestamp;
	this.data = data;
	this.previousHash = previousHash;
	this.hash = '';
    }

    calculateHash() {
	var hash1 = CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	return hash1;
    }
}

class Blockchain {
    constructor() {
	this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
	return new Block(0, "01/11/2021", "Genesis block", "0");
    }

    getLatestBlock() {
	return this.chain[this.chain.length - 1];    // The chain is array of all the blocks whereat this.chain.length - 1 gives us the position of the last block
    }

    addBlock(newBlock) {
	newBlock.previousHash = this.getLatestBlock().hash;    // When adding new block the previous hash must be the same as the hash of the latest block for the new block to be valid
	newBlock.hash = newBlock.calculateHash();    // Create a hash for this block
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
savjeeCoin.addBlock(new Block(1, "10/11/2021", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "12/11/2021", { amount: 10 }));

console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

savjeeCoin.chain[1].data = { amount: 100 };    // Try to tamper with the data changing the amount sent at chain position 1
savjeeCoin[1].hash = savjeeCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + savjeeCoin.isChainValid());

//console.log(JSON.stringify(savjeeCoin, null, 4));

