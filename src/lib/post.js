"use strict"

const fs = require('fs')
    , path = require("path")
    , serviceLogger = path.resolve(process.env.PWD, "logger.log")
    , logPathGenerator = require('./generateLogPath')
    , config = require(path.resolve(process.env.PWD, "config.json"))

module.exports = ($tag = '-', $data = '-', $format = 'plain') => {
    let tag, data
    const now = new Date()
        , moment = now.toISOString().replace(/T/g, ' ').substring(0, 19)
        , allowedTags = Array.from(config.find(c => c.key === "allowed tags").value)
        , maxSize = config.find(c => c.key === "allowed tags").value || 250

    if (allowedTags && allowedTags.length > 0 && !allowedTags.includes($tag)) {
        return 'ko - tag not allowed'
    }
    try {
        tag = $tag.trim().replace(/ /g, '-')
        data = $data.substring(0, maxSize)
        const logPath = logPathGenerator(now)
        fs.appendFileSync(logPath, `${moment};${tag};${$data};${$format}\n`)
        return 'ok'
    } catch (ex) {
        fs.appendFileSync(serviceLogger, `${moment};${ex.message};${$data}\n`)
        return 'ko'
    }
}