//Crypto library which is part of node js provides cryptographic functionality including hashing
const crypto = require("crypto");

//Merkle Nodes represent nodes in the merkle tree.
// Each node has a 2 property
// 1. hash (holds the hash value of the node's data)
// 2. parent (reference to the parent node)

class MerkleNode {
  constructor(hash) {
    this.hash = hash;
    this.parent = null;
  }
}

class MerkleTree {
  constructor(dataChunks) {
    // creating leaf nodes 
    const leaves = dataChunks.map(
      (chunk) => new MerkleNode(this.computeHash(chunk))
    );
    // build the merkle tree from the array of the leaf nodes
    this.root = this.buildMerkleTree(leaves);
  }

  buildMerkleTree(leaves) {
    const numLeaves = leaves.length;
    if (numLeaves === 1) {
      return leaves[0];
    }
    const parents = [];
    let i = 0;
    // pair leaf nodes to create parent nodes.
    while (i < numLeaves) {
    // select two leaves
      const leftChild = leaves[i];
      const rightChild = i + 1 < numLeaves ? leaves[i + 1] : leftChild;
      // create parent
      parents.push(this.createParent(leftChild, rightChild));
      i += 2;
    }
    // recursion call the make the parent of the newly created parents.
    return this.buildMerkleTree(parents);
  }

  createParent(leftChild, rightChild){
    // create a merkleNode for the parent by hashing the concatenated hashes of the children
    const parent = new MerkleNode(this.computeHash(leftChild.hash + rightChild.hash));

    // update the parent reference of the child nodes to point to the newly created parent.
    leftChild.parent = parent;
    rightChild.parent = parent;

    // returns the newly created parent node.
    return parent;
  }

  computeHash(data){
    // create a SHA-265 hash object using createHash.
    const hash = crypto.createHash("sha256");
    //updates the hash object with the data string that you want to hash.
    hash.update(data);
    // etrieves the hash in hexadecimal format using the digest method.
    return hash.digest("hex");
  }
}

const dataChunks = ["data1", "data2", "data3", "data4", "data5","data6"];

const merkleTree = new MerkleTree(dataChunks);

console.log("Merkle Root", merkleTree.root.hash);