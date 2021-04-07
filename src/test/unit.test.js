"use strict"

const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    //, mockFolder = '__mock__'
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogFolder = path.resolve(process.env.PWD, logsFolder)
    , logsFolderTree = require('../lib/logsFolderTree')
    , logPathGenerator = require('../lib/generateLogPath')
    , filterByTag = require('../lib/post')

describe.skip('service unit tests', () => {

    beforeAll(() => {
        if (!fs.existsSync(mockLogFolder))
            fs.mkdirSync(mockLogFolder)
        logsFolderTree()
    })

    afterAll(async () => {
        //fs.rmdirSync(mockLogFolder, { recursive: true })
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

    test('expects logs folder tree to exist', async () => {
        let monthLog = path.resolve(mockLogFolder, '2021', '01')
        expect(fs.existsSync(monthLog)).toBeTruthy()
    })

    test('expects log path generator to generate log path expected', async () => {
        const logPathGenerated = logPathGenerator()
            , now = new Date().toISOString().replace(/T/g, ' ')
            , logPathExpected =
                path.resolve(
                    process.env.PWD,
                    mockLogFolder,
                    ...now.substring(0, 7).split('-'),
                    now.substring(0, 10).replace(/-/g, '_') + '.log'
                )
        expect(logPathGenerated).toBe(logPathExpected)
    })

    test('expects post to return ko - tag not allowed', async () => {
        const tag = 'tag', data = 'data', format = 'plain'
        const response = filterByTag(tag, data, format)
        expect(response).toBe('ko - tag not allowed')
    })

    test('expects post to return ok', async () => {
        const tag = 'login', data = 'data', format = 'plain'
        expect(filterByTag(tag, data, format)).toBe('ok')
    })

    test('expects "allowed tags" setting to exist', async () => {
        expect(config.find(c => c.key === "allowed tags").value).not.toBeNull()
    })

    test('expects appendFileSync to fail', async () => {
        fs.renameSync(mockLogFolder, mockLogFolder + '_')
        const tag = 'login', data = 'data', format = 'plain'
        const response = filterByTag(tag, data, format)
        fs.rmdirSync(mockLogFolder + '_', { recursive: true })
        expect(response).toBe('ko')
    })

})
