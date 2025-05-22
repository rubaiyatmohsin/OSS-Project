// Tea Protocol Rewards - Advanced Integration
const TeaProtocolService = require('./blockchain/TeaProtocolService');
const GitHubService = require('./services/GitHubService');
const EventMonitorService = require('./services/EventMonitorService');
const logger = require('./services/LoggingService');
const config = require('../config/default');

class TeaProtocolRewards {
    constructor() {
        this.projectName = 'tea-protocol-rewards';
        this.version = '1.0.0';
        this.author = 'HeyBroMohsin';
        this.blockchainService = new TeaProtocolService();
        this.githubService = new GitHubService();
        this.eventMonitor = new EventMonitorService(this.blockchainService.provider);
        
        // Initialize event monitoring
        this._setupEventMonitoring();
    }

    _setupEventMonitoring() {
        // Monitor reward distributions
        this.eventMonitor.registerEventHandler("RewardDistributed", (event) => {
            logger.logRewardDistribution(event.to, event.amount, event);
        });

        // Monitor stakes
        this.eventMonitor.registerEventHandler("Stake", (event) => {
            logger.logTransaction(event.transactionHash, "Stake", event);
        });

        // Start monitoring events
        this.eventMonitor.monitorTeaEvents().catch(error => {
            logger.error("Failed to start event monitoring", error);
        });
    }

    getProjectInfo() {
        return {
            name: this.projectName,
            version: this.version,
            description: 'A blockchain rewards project for OSS contributions using tea protocol',
            ecosystem: 'tea protocol',
            author: this.author
        };
    }

    async calculateContribution(username, days = 30) {
        try {
            // Get GitHub contributions
            const githubStats = await this.githubService.getRecentContributions(username, days);
            const qualityMetrics = await this.githubService.getCodeQualityMetrics(username);
            
            const weights = config.contribution.weights;
            const multipliers = config.contribution.multipliers;
            
            // Calculate base scores
            const commitScore = githubStats.commits * weights.commit;
            const issueScore = githubStats.issues * weights.issue;
            const prScore = githubStats.pullRequests * weights.pullRequest;
            
            // Apply quality multipliers based on metrics
            const qualityMultiplier = this._calculateQualityMultiplier(qualityMetrics);
            const impactMultiplier = multipliers.impact;
            
            const totalScore = (commitScore + issueScore + prScore) * qualityMultiplier * impactMultiplier;
            
            // Get project stake for context
            const projectStake = await this.blockchainService.getProjectStake();
            
            const result = {
                contributionScore: Math.round(totalScore),
                breakdown: {
                    commits: commitScore,
                    issues: issueScore,
                    pullRequests: prScore,
                    qualityBonus: qualityMultiplier,
                    impactBonus: impactMultiplier
                },
                metrics: {
                    mergeRate: qualityMetrics.mergeRate,
                    codeReviewActivity: qualityMetrics.averageReviewComments
                },
                projectContext: {
                    totalStake: projectStake
                },
                details: githubStats.details
            };

            logger.logContribution(username, "calculation", result);
            return result;

        } catch (error) {
            logger.error("Failed to calculate contribution", error);
            throw error;
        }
    }

    _calculateQualityMultiplier(metrics) {
        // Base multiplier
        let multiplier = 1.0;
        
        // Adjust based on merge rate (0-100%)
        if (metrics.mergeRate > 0.8) multiplier += 0.2;
        else if (metrics.mergeRate > 0.6) multiplier += 0.1;
        
        // Adjust based on code review activity
        if (metrics.averageReviewComments > 5) multiplier += 0.2;
        else if (metrics.averageReviewComments > 2) multiplier += 0.1;
        
        return multiplier;
    }

    async distributeRewards(contributorAddress, score) {
        try {
            // Convert contribution score to token amount
            const tokenAmount = score / 100; // 100 points = 1 token
            
            // Distribute rewards using blockchain
            const txHash = await this.blockchainService.distributeRewards(contributorAddress, tokenAmount);
            
            const result = {
                success: true,
                transactionHash: txHash,
                amount: tokenAmount,
                recipient: contributorAddress
            };

            logger.logRewardDistribution(contributorAddress, tokenAmount, result);
            return result;

        } catch (error) {
            logger.error("Failed to distribute rewards", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getContributorBalance(address) {
        try {
            const balance = await this.blockchainService.getTeaBalance(address);
            const recentActivity = await this.eventMonitor.getRecentActivity(address);
            
            return {
                address,
                balance,
                token: 'TEA',
                recentActivity
            };
        } catch (error) {
            logger.error("Failed to get contributor balance", error);
            throw error;
        }
    }

    async getContributorHistory(username, address) {
        try {
            const [githubStats, onchainActivity] = await Promise.all([
                this.githubService.getContributorStats(username),
                this.eventMonitor.getRecentActivity(address)
            ]);

            return {
                github: githubStats,
                blockchain: onchainActivity
            };
        } catch (error) {
            logger.error("Failed to get contributor history", error);
            throw error;
        }
    }
}

// Example usage
async function main() {
    const rewards = new TeaProtocolRewards();
    console.log('Project Info:', rewards.getProjectInfo());
    
    try {
        // Calculate contribution for a user
        const contribution = await rewards.calculateContribution('HeyBroMohsin');
        console.log('Sample Contribution:', contribution);
        
        // Get contributor balance and history
        const balance = await rewards.getContributorBalance('0xAE391ca661db1820172e2046fFEb53D0df74A144');
        console.log('Contributor Balance:', balance);
        
        const history = await rewards.getContributorHistory('HeyBroMohsin', '0xAE391ca661db1820172e2046fFEb53D0df74A144');
        console.log('Contributor History:', history);
    } catch (error) {
        logger.error('Error in main execution:', error);
    }
}

// Run the example if this file is run directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = TeaProtocolRewards; 