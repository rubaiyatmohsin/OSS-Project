const { ethers } = require('ethers');
const config = require('../../config/default');

class EventMonitorService {
    constructor(provider) {
        this.provider = provider;
        this.eventHandlers = new Map();
    }

    async monitorTeaEvents() {
        const teaTokenAddress = config.blockchain.contracts.teaToken;
        const teaTokenABI = [
            "event Transfer(address indexed from, address indexed to, uint256 value)",
            "event Approval(address indexed owner, address indexed spender, uint256 value)",
            "event Stake(address indexed user, uint256 amount)",
            "event Unstake(address indexed user, uint256 amount)",
            "event RewardDistributed(address indexed to, uint256 amount)"
        ];

        const contract = new ethers.Contract(teaTokenAddress, teaTokenABI, this.provider);

        // Monitor Transfer events
        contract.on("Transfer", (from, to, value, event) => {
            this._handleEvent("Transfer", {
                from,
                to,
                value: ethers.formatEther(value),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            });
        });

        // Monitor Stake events
        contract.on("Stake", (user, amount, event) => {
            this._handleEvent("Stake", {
                user,
                amount: ethers.formatEther(amount),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            });
        });

        // Monitor Reward Distribution events
        contract.on("RewardDistributed", (to, amount, event) => {
            this._handleEvent("RewardDistributed", {
                to,
                amount: ethers.formatEther(amount),
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            });
        });
    }

    registerEventHandler(eventName, handler) {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        this.eventHandlers.get(eventName).push(handler);
    }

    _handleEvent(eventName, eventData) {
        const handlers = this.eventHandlers.get(eventName) || [];
        handlers.forEach(handler => {
            try {
                handler(eventData);
            } catch (error) {
                console.error(`Error in ${eventName} event handler:`, error);
            }
        });
    }

    async getPastEvents(eventName, fromBlock, toBlock) {
        const teaTokenAddress = config.blockchain.contracts.teaToken;
        const teaTokenABI = [
            "event Transfer(address indexed from, address indexed to, uint256 value)",
            "event Stake(address indexed user, uint256 amount)",
            "event RewardDistributed(address indexed to, uint256 amount)"
        ];

        const contract = new ethers.Contract(teaTokenAddress, teaTokenABI, this.provider);
        const filter = contract.filters[eventName]();
        const events = await contract.queryFilter(filter, fromBlock, toBlock);

        return events.map(event => {
            const parsed = contract.interface.parseLog(event);
            return {
                ...parsed.args,
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber
            };
        });
    }

    async getRecentActivity(address, blocks = 10000) {
        const currentBlock = await this.provider.getBlockNumber();
        const fromBlock = currentBlock - blocks;

        const activities = [];

        // Get transfer events
        const transfers = await this.getPastEvents("Transfer", fromBlock, currentBlock);
        activities.push(...transfers.filter(t => 
            t.from.toLowerCase() === address.toLowerCase() || 
            t.to.toLowerCase() === address.toLowerCase()
        ));

        // Get stake events
        const stakes = await this.getPastEvents("Stake", fromBlock, currentBlock);
        activities.push(...stakes.filter(s => 
            s.user.toLowerCase() === address.toLowerCase()
        ));

        // Get reward events
        const rewards = await this.getPastEvents("RewardDistributed", fromBlock, currentBlock);
        activities.push(...rewards.filter(r => 
            r.to.toLowerCase() === address.toLowerCase()
        ));

        return activities.sort((a, b) => b.blockNumber - a.blockNumber);
    }
}

module.exports = EventMonitorService; 