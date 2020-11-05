const {createLogger, format, transports} = require('winston');
const winston = require('winston')

const logger = winston.createLogger({
    // 可用于展示 error: 0, warn: 1, info: 2, verbose: 3, debug: 4 级别的 log
    level: 'info',
    format: format.simple(),
    transports: [
        new winston.transports.Console({
            level: 'error',
            format: format.combine(
                format.colorize(),
                format.simple()
            ),
        }),
        new winston.transports.File({filename: 'logs/all.log'}),
    ]
})

if (process.env.NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({level: 'debug'}))
}

module.exports = logger