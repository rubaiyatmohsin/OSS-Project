require('dotenv').config();

module.exports = {
    blockchain: {
        network: 'sepolia',
        infuraApiKey: process.env.INFURA_API_KEY,
        contracts: {
            teaToken: process.env.TEA_TOKEN_ADDRESS,
            teaStaking: process.env.TEA_STAKING_ADDRESS
        }
    },
    project: {
        address: process.env.PROJECT_ADDRESS,
        github: {
            token: process.env.GITHUB_TOKEN,
            owner: 'rubaiyatmohsin',
            repo: 'OSS-Project'
        }
    },
    contribution: {
        weights: {
            commit: 10,
            issue: 5,
            pullRequest: 15
        },
        multipliers: {
            quality: 1.2,
            impact: 1.1
        }
    }
}; 