const winston = require('winston');
const path = require('path');

class LoggingService {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                // Write all logs to console
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
                // Write all logs to files
                new winston.transports.File({ 
                    filename: path.join(__dirname, '../../logs/error.log'), 
                    level: 'error' 
                }),
                new winston.transports.File({ 
                    filename: path.join(__dirname, '../../logs/combined.log')
                })
            ]
        });

        // Handle uncaught exceptions
        this.logger.exceptions.handle(
            new winston.transports.File({ 
                filename: path.join(__dirname, '../../logs/exceptions.log')
            })
        );

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (ex) => {
            throw ex;
        });
    }

    info(message, meta = {}) {
        this.logger.info(message, meta);
    }

    error(message, error = null) {
        const meta = error ? {
            error: {
                message: error.message,
                stack: error.stack,
                ...error
            }
        } : {};
        this.logger.error(message, meta);
    }

    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }

    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }

    // Log blockchain specific events
    logTransaction(txHash, type, details = {}) {
        this.info(`Blockchain Transaction: ${type}`, {
            transactionHash: txHash,
            type,
            ...details
        });
    }

    // Log GitHub activity
    logGitHubActivity(activity, details = {}) {
        this.info(`GitHub Activity: ${activity}`, {
            activity,
            timestamp: new Date().toISOString(),
            ...details
        });
    }

    // Log contribution events
    logContribution(contributor, type, details = {}) {
        this.info(`New Contribution: ${type}`, {
            contributor,
            type,
            timestamp: new Date().toISOString(),
            ...details
        });
    }

    // Log reward distribution
    logRewardDistribution(recipient, amount, details = {}) {
        this.info(`Reward Distribution`, {
            recipient,
            amount,
            timestamp: new Date().toISOString(),
            ...details
        });
    }
}

module.exports = new LoggingService(); 