// Simple example module that demonstrates basic functionality

class TeaDemo {
    constructor() {
        this.projectName = 'tea-demo-project';
        this.version = '1.0.0';
    }

    getProjectInfo() {
        return {
            name: this.projectName,
            version: this.version,
            description: 'A demo project for tea protocol on Sepolia testnet',
            ecosystem: 'tea protocol'
        };
    }

    calculateContribution(commits, issues, prs) {
        // Simple mock calculation of contribution score
        const score = (commits * 10) + (issues * 5) + (prs * 15);
        return {
            contributionScore: score,
            breakdown: {
                commits: commits * 10,
                issues: issues * 5,
                pullRequests: prs * 15
            }
        };
    }
}

// Example usage
const demo = new TeaDemo();
console.log('Project Info:', demo.getProjectInfo());
console.log('Sample Contribution:', demo.calculateContribution(5, 3, 2)); 