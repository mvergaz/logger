"use strict"

const path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)

module.exports = ($now = new Date()) => {
    const now = $now.toISOString().replace(/T/g, ' ')
        , logPath = now.substring(0, 7).split('-')
        , logName = now.substring(0, 10).replace(/-/g, '_') + '.log'
    return path.resolve(process.env.PWD, mockLogsFolder, ...logPath, logName)
}