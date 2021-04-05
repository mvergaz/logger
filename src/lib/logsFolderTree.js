"use strict"
const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)

/**
* Ensures the logs folder tree to be created on startup
*/
module.exports = () => {

    if (fs.existsSync(mockLogsFolder)) {
        let yearFolder
            , month
            , monthFolder
        for (let i = 2020; i < 2100; i++) {
            yearFolder = path.resolve(mockLogsFolder, i.toString())
            if (!fs.existsSync(yearFolder))
                fs.mkdirSync(yearFolder)

            for (let y = 1; y < 13; y++) {
                month = y.toString().padStart(2, '0')
                monthFolder = path.resolve(yearFolder, month)
                if (!fs.existsSync(monthFolder))
                    fs.mkdirSync(monthFolder)
            }
        }
    }/*istanbul ignore next*/else {
        fs.mkdirSync(mockLogsFolder)
        this()
    }
}