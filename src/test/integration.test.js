"use strict"
const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogFolder = path.resolve(process.env.PWD, logsFolder)
    , logsFolderTree = require('../lib/logsFolderTree')
    , logPathGenerator = require('../lib/generateLogPath')
    , filterByTag = require('../lib/filterByTag')

describe('service integration tests', () => {
    beforeAll(() => {
        if (!fs.existsSync(mockLogFolder))
            fs.mkdirSync(mockLogFolder)
        logsFolderTree()
    })

    afterAll(async () => {
        //fs.rmdirSync(mockLogFolder, { recursive: true })
    })

    test('expects filterByTag to create correct log entry', async () => {
        const tag = 'tag', data = 'data', format = 'plain'
            , moment = new Date().toISOString().replace(/T/g, ' ').substring(0, 19)
            , expectedEntry = `${moment};${tag};${data};${format}\n`
            , logPathGenerated = logPathGenerator()
        fs.writeFileSync(logPathGenerated,'')
        filterByTag(tag,data,format)
        expect(fs.readFileSync(logPathGenerated).toString()).toBe(expectedEntry)
    })
})
