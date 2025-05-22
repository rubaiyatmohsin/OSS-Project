const axios = require('axios');
const config = require('../../config/default');

class GitHubService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    }

    async getContributorStats() {
        try {
            const { owner, repo } = config.project.github;
            const response = await this.axiosInstance.get(
                `/repos/${owner}/${repo}/stats/contributors`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get contributor stats: ${error.message}`);
        }
    }

    async getRecentContributions(username, days = 30) {
        try {
            const { owner, repo } = config.project.github;
            const since = new Date();
            since.setDate(since.getDate() - days);

            // Get commits
            const commits = await this.axiosInstance.get(
                `/repos/${owner}/${repo}/commits`,
                {
                    params: {
                        author: username,
                        since: since.toISOString()
                    }
                }
            );

            // Get issues
            const issues = await this.axiosInstance.get(
                `/repos/${owner}/${repo}/issues`,
                {
                    params: {
                        creator: username,
                        state: 'all',
                        since: since.toISOString()
                    }
                }
            );

            // Get pull requests
            const prs = await this.axiosInstance.get(
                `/repos/${owner}/${repo}/pulls`,
                {
                    params: {
                        state: 'all',
                        creator: username
                    }
                }
            );

            return {
                commits: commits.data.length,
                issues: issues.data.length,
                pullRequests: prs.data.length,
                details: {
                    commits: commits.data.map(c => ({
                        sha: c.sha,
                        message: c.commit.message,
                        date: c.commit.author.date
                    })),
                    issues: issues.data.map(i => ({
                        number: i.number,
                        title: i.title,
                        state: i.state,
                        created_at: i.created_at
                    })),
                    pullRequests: prs.data.map(p => ({
                        number: p.number,
                        title: p.title,
                        state: p.state,
                        created_at: p.created_at
                    }))
                }
            };
        } catch (error) {
            throw new Error(`Failed to get recent contributions: ${error.message}`);
        }
    }

    async getCodeQualityMetrics(username) {
        try {
            const { owner, repo } = config.project.github;
            
            // Get user's pull requests
            const prs = await this.axiosInstance.get(
                `/repos/${owner}/${repo}/pulls`,
                {
                    params: {
                        state: 'closed',
                        creator: username
                    }
                }
            );

            // Analyze code review comments and merge success rate
            let totalReviewComments = 0;
            let mergedPRs = 0;

            for (const pr of prs.data) {
                const reviews = await this.axiosInstance.get(
                    `/repos/${owner}/${repo}/pulls/${pr.number}/reviews`
                );
                totalReviewComments += reviews.data.length;
                if (pr.merged) mergedPRs++;
            }

            return {
                totalPRs: prs.data.length,
                mergedPRs,
                mergeRate: prs.data.length > 0 ? (mergedPRs / prs.data.length) : 0,
                averageReviewComments: prs.data.length > 0 ? (totalReviewComments / prs.data.length) : 0
            };
        } catch (error) {
            throw new Error(`Failed to get code quality metrics: ${error.message}`);
        }
    }
}

module.exports = GitHubService; 