"use strict"

const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogsFolder = path.resolve(process.env.PWD, logsFolder)

const ensureFolder = (parent, folder) => {
    let folderPath = path.resolve(parent, folder)
    if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath)
    return folderPath
}

/**
* Ensures the logs folder tree to be created on startup
*/
module.exports = () => {

    if (fs.existsSync(mockLogsFolder)) {

        let yearFolder, month

        for (let i = 2020; i < 2022; i++) {
            yearFolder = ensureFolder(mockLogsFolder, i.toString())

            for (let y = 1; y < 13; y++) {
                month = y.toString().padStart(2, '0')
                ensureFolder(yearFolder, month)
            }
        }
    }/*istanbul ignore next*/else {
        fs.mkdirSync(mockLogsFolder)
        this()
    }
}