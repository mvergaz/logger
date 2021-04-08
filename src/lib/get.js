"use strict"

const fs = require('fs')
    , path = require('path')
    , getConfig = require('../lib/getConfig')
    , logsFolderPath = path.resolve(process.env.PWD, getConfig('logs folder').value || 'logs')

/**
 * Pipe all logs files to an end-point response
 */
module.exports = (res) => {

    let yearFolderPath
        , monthFolderPath
        , logFilePath

    fs.readdirSync(logsFolderPath).forEach(y => {
        yearFolderPath = path.resolve(logsFolderPath, y)
        if (fs.statSync(yearFolderPath).isDirectory()) {
            fs.readdirSync(yearFolderPath).forEach(m => {
                monthFolderPath = path.resolve(yearFolderPath, m)
                if (fs.statSync(monthFolderPath).isDirectory()) {
                    fs.readdirSync(monthFolderPath).forEach(log => {
                        logFilePath = path.resolve(monthFolderPath, log)                        
                        fs.createReadStream(logFilePath).pipe(res)
                    })
                }
            })
        }
    })
}