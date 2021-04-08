"use strict"

const fs = require('fs')
    , path = require("path")
    , serviceLogger = path.resolve(process.env.PWD, "logger.log")
    , logPathGenerator = require('../lib/logPathGenerator')    
    , getConfig = require('../lib/getConfig')
    , responser = require('../lib/responser')

module.exports = ($tag = '-', $data = '-', $format = 'plain') => {
    let tag, data
    const now = new Date()
        , moment = now.toISOString().replace(/T/g, ' ').substring(0, 19)
        , allowedTags = Array.from(getConfig("allowed tags").value)
        , maxSize = getConfig("max data size").value || 250

    if (allowedTags && allowedTags.length > 0 && !allowedTags.includes($tag)) {
        return responser.TAG_NOT_ALLOWED
    }
    try {
        tag = $tag.trim().replace(/ /g, '-')
        data = $data.substring(0, maxSize)
        let logPath = logPathGenerator(now)
        fs.appendFileSync(logPath, `${moment};${tag};${data};${$format}\n`)
        return responser.OK
    } catch (ex) {
        fs.appendFileSync(serviceLogger, `${moment};${ex.message};${$data}\n`)
        return responser.KO
    }
}