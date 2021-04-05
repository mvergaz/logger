"use strict"
const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)
//, mockLogsFolderTree = require('./logsFolderTree')

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
    let now = new Date().toISOString().replace(/T/g, ' ').substring(0, 19)
    let destLog = now.substring(0, 7)
    let destFolder = findFolder(destLog)
    if (fs.existsSync(destFolder)) {
        let logName = now.substring(0, 10).replace(/-/g, '_')
        let logFullName = path.resolve(destFolder, logName + '.log')
        try{
            fs.appendFileSync(logFullName, `${now};${origin};${tag};${data}\n`)
            return '200-ok'
        }catch(ex){
            return ex.message
        }
        
    } else {
        return '400-No dest folder found'
    }
}