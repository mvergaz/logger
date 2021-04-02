"use strict"
const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , mockFolder = '__mock__'
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogFolder = path.resolve(process.env.PWD, mockFolder, logsFolder )

describe('service unit tests', () => {

    beforeAll(() => {
        fs.mkdirSync( mockLogFolder )
    })

    afterAll(async () => {
        fs.rmdirSync( mockLogFolder )
    })

    test('expects the config file to exist', async () => {
        expect(fs.existsSync(configFilePath)).toBe(true)
    })

    test('expects port number to be > 3000', async () => {
        const port = config.find(c => c.key === "port number").value
        expect(port).toBeGreaterThan(3000)
    })

    test('expects logs folder not to be null', async () => {
        const logsFolder = config.find(c => c.key === "logs folder").value
        expect(logsFolder).not.toBeNull()
    })

    test('expects logs folder to exists', async () => {        
        expect(fs.existsSync(mockLogFolder)).toBeTruthy()
    })

})
