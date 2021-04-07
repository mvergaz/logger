"use strict"

const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)

/**
 * Merge in only one all logs files
 */
module.exports = (res) => {

    let yearFolder
        , monthFolder
        , logFile
        //, fileStream

    fs.readdirSync(mockLogsFolder).forEach(y => {
        yearFolder = path.resolve(mockLogsFolder, y)
        if (fs.statSync(yearFolder).isDirectory()) {
            fs.readdirSync(yearFolder).forEach(m => {
                monthFolder = path.resolve(yearFolder, m)
                if (fs.statSync(monthFolder).isDirectory()) {
                    fs.readdirSync(monthFolder).forEach(log => {
                        logFile = path.resolve(monthFolder, log)                        
                        //fs.createReadStream(logFile).pipe(process.stdout)
                        fs.createReadStream(logFile).pipe(res)
                    })
                }
            })
        }
    })    
}