// Tea Protocol Rewards - Contribution tracking and scoring module

class TeaProtocolRewards {
    constructor() {
        this.projectName = 'tea-protocol-rewards';
        this.version = '1.0.0';
        this.author = 'HeyBroMohsin';
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

    calculateContribution(commits, issues, prs) {
        // Enhanced contribution score calculation
        const commitScore = commits * 10;  // Base commit score
        const issueScore = issues * 5;     // Issue management score
        const prScore = prs * 15;          // PR contribution score
        
        // Additional multipliers for quality and impact
        const qualityMultiplier = 1.2;     // Can be adjusted based on code quality metrics
        const impactMultiplier = 1.1;      // Can be adjusted based on community impact
        
        const totalScore = (commitScore + issueScore + prScore) * qualityMultiplier * impactMultiplier;
        
        return {
            contributionScore: Math.round(totalScore),
            breakdown: {
                commits: commitScore,
                issues: issueScore,
                pullRequests: prScore,
                qualityBonus: qualityMultiplier,
                impactBonus: impactMultiplier
            }
        };
    }
}

// Example usage
const rewards = new TeaProtocolRewards();
console.log('Project Info:', rewards.getProjectInfo());
console.log('Sample Contribution:', rewards.calculateContribution(5, 3, 2)); 