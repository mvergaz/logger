"use strict"
/* istanbul ignore file */

const fs = require("fs")
    , path = require("path")
    , app = require('express')()
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , getConfig = require('./lib/getConfig')
let listenerPort = 3000;

if (fs.existsSync(configFilePath)) {    
    console.log("Config file found. Search for a valid port number > 3000...")
    const port = getConfig( "port number").value || 3000
    if (port > 3000)
        listenerPort = port
} else {
    console.log("No config file found... exit")
    process.exit(0)
}

require('./routes')(app);
const server = app.listen(process.env.PORT || listenerPort, () =>
    console.log("logger microservice listening on http://localhost:" + listenerPort)
)
module.exports = server