"use strict"

const fs = require('fs')
    , path = require('path')
    , getConfig = require('./getConfig')
    , mockLogsFolder = path.resolve(process.env.PWD, getConfig('logs folder').value || 'logs')

/**
 * Pipe all logs files to end-point response
 */
module.exports = (res) => {

    let yearFolder
        , monthFolder
        , logFile

    fs.readdirSync(mockLogsFolder).forEach(y => {
        yearFolder = path.resolve(mockLogsFolder, y)
        if (fs.statSync(yearFolder).isDirectory()) {
            fs.readdirSync(yearFolder).forEach(m => {
                monthFolder = path.resolve(yearFolder, m)
                if (fs.statSync(monthFolder).isDirectory()) {
                    fs.readdirSync(monthFolder).forEach(log => {
                        logFile = path.resolve(monthFolder, log)                        
                        fs.createReadStream(logFile).pipe(res)
                    })
                }
            })
        }
    })
}