"use strict"

const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)    

module.exports = (key) => {
    return config.find(c => c.key === key)
}