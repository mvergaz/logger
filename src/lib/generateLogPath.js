"use strict"

const path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)

module.exports = ($now) => {
    const now = $now.toISOString().replace(/T/g, ' ').substring(0, 7)
    return path.resolve(process.env.PWD, mockLogsFolder, ...now.split('-'))
}