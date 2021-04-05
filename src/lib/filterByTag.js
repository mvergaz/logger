"use strict"
const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)
    , logPathGenerator = require('./generateLogPath')

const findFolder = ($destLog) => {
    let dest = $destLog.split('-')
    return path.resolve(process.env.PWD, mockLogsFolder, ...dest)
}


module.exports = ($origin, $tag, $data, $format = 'plain') => {
    let origin, tag, data;

    if (!$origin) {
        return '400-No origin found'
    }
    if (!$tag) {
        return '400-No tag found'
    }
    if (!$data) {
        return '400-No data found'
    }
    origin = $origin.trim()
    tag = $tag.trim().replace(/ /g, '-')
    data = ($format == 'json') ? JSON.serialize($data) : $data    
    let now = new Date()
    let destFolder = logPathGenerator(now)
    if (fs.existsSync(destFolder)) {
        let logName = now.toISOString().substring(0, 10).replace(/-/g, '_')
        let logFullName = path.resolve(destFolder, logName + '.log')
        try{
            const moment = now.toISOString().replace(/T/g, ' ').substring(0, 19)
            fs.appendFileSync(logFullName, `${moment};${origin};${tag};${data};${$format}\n`)
            return '200-ok'
        }catch(ex){
            return ex.message
        }
        
    } /*istanbul ignore next*/ else {
        return '400-No dest folder found'
    }
}