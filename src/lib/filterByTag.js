"use strict"

const fs = require('fs')
    , path = require("path")    
    , serviceLogger = path.resolve(process.env.PWD, "logger.log")
    , logPathGenerator = require('./generateLogPath')

module.exports = ($tag = '-', $data = '-', $format = 'plain') => {
    let tag, data
    const now = new Date()
        , moment = now.toISOString().replace(/T/g, ' ').substring(0, 19)
    try {
        tag = $tag.trim().replace(/ /g, '-')        
        const logPath = logPathGenerator(now)        
        fs.appendFileSync(logPath, `${moment};${tag};${$data};${$format}\n`)
        return 'ok'
    } catch (ex) {        
        fs.appendFileSync(serviceLogger, `${moment};${ex.message};${$data}\n`)
        return 'ko'
    }
}