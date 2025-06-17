const mongoose = require('mongoose');
const validator = require('validator');

const blockchainSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User ID is required'],
    index: true
  },
  transactionHash: { 
    type: String, 
    required: [true, 'Transaction hash is required'],
    unique: true,
    validate: {
      validator: function(v) {
        // Basic validation for common blockchain transaction hashes
        return /^0x([A-Fa-f0-9]{64})$/.test(v) || /^[A-Fa-f0-9]{64}$/.test(v);
      },
      message: 'Invalid transaction hash format'
    },
    index: true
  },
  blockchainNetwork: {
    type: String,
    required: [true, 'Blockchain network is required'],
    enum: ['ethereum', 'polygon', 'binance', 'solana', 'arbitrum', 'optimism'],
    index: true
  },
  contractAddress: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^0x([A-Fa-f0-9]{40})$/.test(v);
      },
      message: 'Invalid contract address format'
    },
    index: true
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['mint', 'transfer', 'burn', 'approval', 'contract_execution'],
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed', 'reverted'],
    default: 'pending'
  },
  blockNumber: {
    type: Number,
    min: 0
  },
  gasUsed: {
    type: Number,
    min: 0
  },
  gasPrice: {
    type: String // Stored as string to handle large numbers
  },
  tokenId: {
    type: String // For NFT transactions
  },
  amount: {
    type: String // Stored as string to handle large numbers/decimal precision
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // For storing additional transaction details
  },
  confirmationCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true,
    index: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  confirmedAt: {
    type: Date
  }
}, {
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove version key
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Compound indexes for common query patterns
blockchainSchema.index({ userId: 1, status: 1 });
blockchainSchema.index({ blockchainNetwork: 1, status: 1 });
blockchainSchema.index({ transactionType: 1, createdAt: -1 });
blockchainSchema.index({ contractAddress: 1, tokenId: 1 });

// Pre-save hook to update timestamps
blockchainSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'confirmed') {
    this.confirmedAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

// Virtual property for transaction age
blockchainSchema.virtual('transactionAge').get(function() {
  return Date.now() - this.createdAt;
});

// Static method to get pending transactions
blockchainSchema.statics.getPendingTransactions = function(network) {
  const query = { status: 'pending' };
  if (network) query.blockchainNetwork = network;
  
  return this.find(query)
    .sort({ createdAt: 1 })
    .limit(100);
};

// Static method to get user transactions
blockchainSchema.statics.getUserTransactions = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to check if transaction exists
blockchainSchema.statics.transactionExists = async function(transactionHash) {
  const count = await this.countDocuments({ transactionHash });
  return count > 0;
};

// Static method to update transaction status
blockchainSchema.statics.updateTransactionStatus = function(transactionHash, status, blockNumber, gasUsed) {
  return this.findOneAndUpdate(
    { transactionHash },
    { 
      status,
      blockNumber,
      gasUsed,
      $inc: { confirmationCount: 1 },
      updatedAt: new Date(),
      ...(status === 'confirmed' ? { confirmedAt: new Date() } : {})
    },
    { new: true }
  );
};

module.exports = mongoose.model('Blockchain', blockchainSchema);
