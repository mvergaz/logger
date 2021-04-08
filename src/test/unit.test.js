"use strict"

const fs = require('fs')
    , path = require("path")
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , logsFolderPath = path.resolve(process.env.PWD, logsFolder)
    , logsFolderTree = require('../lib/logsFolderTree')
    , logPathGenerator = require('../lib/logPathGenerator')
    , post = require('../lib/post')
    , responser = require('../lib/responser')

describe.skip('service unit tests', () => {

    beforeAll(() => {
        if (!fs.existsSync(logsFolderPath))
            fs.mkdirSync(logsFolderPath)
        logsFolderTree()
    })

    afterAll(async () => {
        //fs.rmdirSync(logsFolderPath, { recursive: true })
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
        expect(fs.existsSync(logsFolderPath)).toBeTruthy()
    })

    test('expects logs folder tree to exist', async () => {
        let monthLog = path.resolve(logsFolderPath, '2021', '01')
        expect(fs.existsSync(monthLog)).toBeTruthy()
    })

    test('expects log path generator to generate log path expected', async () => {
        const logPathGenerated = logPathGenerator()
            , now = new Date().toISOString().replace(/T/g, ' ')
            , logPathExpected =
                path.resolve(
                    process.env.PWD,
                    logsFolderPath,
                    ...now.substring(0, 7).split('-'),
                    now.substring(0, 10).replace(/-/g, '_') + '.log'
                )
        expect(logPathGenerated).toBe(logPathExpected)
    })

    test('expects post to return ko - tag not allowed', async () => {
        const tag = 'tag', data = 'data', format = 'plain'
        const response = post(tag, data, format)
        expect(response).toBe(responser.TAG_NOT_ALLOWED)
    })

    test('expects post to return ok', async () => {
        const tag = 'login', data = 'data', format = 'plain'
        expect(post(tag, data, format)).toBe(responser.OK)
    })

    test('expects "allowed tags" setting to exist', async () => {
        expect(config.find(c => c.key === "allowed tags").value).not.toBeNull()
    })

    test('expects appendFileSync to fail', async () => {
        fs.renameSync(logsFolderPath, logsFolderPath + '_')
        const tag = 'login', data = 'data', format = 'plain'
        const response = post(tag, data, format)
        fs.rmdirSync(logsFolderPath + '_', { recursive: true })
        expect(response).toBe(responser.KO)
    })
})
