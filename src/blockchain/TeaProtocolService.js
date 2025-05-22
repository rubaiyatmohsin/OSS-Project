const { ethers } = require('ethers');
require('dotenv').config();

class TeaProtocolService {
    constructor() {
        // Sepolia testnet configuration
        this.network = 'sepolia';
        this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    }

    async connectWallet(privateKey) {
        try {
            this.signer = new ethers.Wallet(privateKey, this.provider);
            return this.signer.address;
        } catch (error) {
            throw new Error(`Failed to connect wallet: ${error.message}`);
        }
    }

    async getTeaBalance(address) {
        try {
            // Tea token contract address on Sepolia (you'll need to replace this with actual address)
            const teaTokenAddress = process.env.TEA_TOKEN_ADDRESS;
            const teaTokenABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function symbol() view returns (string)"
            ];

            const tokenContract = new ethers.Contract(teaTokenAddress, teaTokenABI, this.provider);
            const balance = await tokenContract.balanceOf(address);
            return ethers.formatEther(balance);
        } catch (error) {
            throw new Error(`Failed to get TEA balance: ${error.message}`);
        }
    }

    async distributeRewards(contributorAddress, amount) {
        try {
            if (!this.signer) {
                throw new Error('Wallet not connected');
            }

            const teaTokenAddress = process.env.TEA_TOKEN_ADDRESS;
            const teaTokenABI = [
                "function transfer(address to, uint amount) returns (bool)"
            ];

            const tokenContract = new ethers.Contract(teaTokenAddress, teaTokenABI, this.signer);
            const tx = await tokenContract.transfer(contributorAddress, ethers.parseEther(amount.toString()));
            await tx.wait();
            return tx.hash;
        } catch (error) {
            throw new Error(`Failed to distribute rewards: ${error.message}`);
        }
    }

    async getProjectStake() {
        try {
            // Implement tea protocol specific staking query
            // This will need to be updated with actual tea protocol contract details
            const teaStakingAddress = process.env.TEA_STAKING_ADDRESS;
            const stakingABI = [
                "function getProjectStake(address project) view returns (uint256)"
            ];

            const stakingContract = new ethers.Contract(teaStakingAddress, stakingABI, this.provider);
            const stake = await stakingContract.getProjectStake(process.env.PROJECT_ADDRESS);
            return ethers.formatEther(stake);
        } catch (error) {
            throw new Error(`Failed to get project stake: ${error.message}`);
        }
    }
}

module.exports = TeaProtocolService; 