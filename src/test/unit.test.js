"use strict"
const fs = require('fs')
const path = require("path")
const configFilePath = path.resolve(process.env.PWD, "config.json")
const config = require(configFilePath)


describe('service unit tests', () => {
    const port = config.find( c => c.key === "port number" ).value || 3000
    const logsFolder = config.find( c => c.key === "logs folder" ).value

    test('expects the config file to exist', async () => {
        expect(fs.existsSync(configFilePath)).toBe(true)
    })

    test('expects port number to be > 3000', async () => {
        expect(port).toBeGreaterThan(3000)
    })

    test('expects logs folder not to be null', async () => {
        expect(logsFolder).not.toBeNull()
    })

})
