"use strict"

const fs = require('fs')
    , path = require("path")
    , request = require('supertest')
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , mockLogFolder = path.resolve(process.env.PWD, logsFolder)
    , logsFolderTree = require('../lib/logsFolderTree')
    , logPathGenerator = require('../lib/generateLogPath')
    , filterByTag = require('../lib/post')

let server

describe('service integration tests', () => {
    beforeAll(() => {
        if (!fs.existsSync(mockLogFolder))
            fs.mkdirSync(mockLogFolder)
        logsFolderTree()
        server = require('../index')
    })

    afterAll(async () => {
        //fs.rmdirSync(mockLogFolder, { recursive: true })
        await server.close();
    })

    test('expects error after error', async () => {
        const response = await request(server).get('/500')
        expect(response.status).toBe(500)
    })


    test('expects pong after ping', async () => {
        const response = await request(server).get('/ping')
        expect(response.body).toMatchObject({ message: "pong" })
    })

    test('expects post / to create expected entry', async () => {
        const tag = 'login', data = 'data', format = 'plain'
            , now = new Date().toISOString().replace(/T/g, ' ').substring(0, 19)
            , expectedEntry = `${now};${tag};${data};${format}\n`
            , logPathGenerated = logPathGenerator()
        fs.writeFileSync(logPathGenerated, '')
        const response = await request(server).post('/').send({
            tag, data, format
        })
        expect(response.body).toMatchObject({ message: 'ok' })
        expect(fs.readFileSync(logPathGenerated).toString()).toBe(expectedEntry)
    })

    test('expects post / to refuse entry', async () => {
        const tag = 'log', data = 'data', format = 'plain'
        const response = await request(server).post('/').send({
            tag, data, format
        })
        expect(response.body).toMatchObject({ message: 'ko - tag not allowed' })

    })

    test.only('expects get', async () => {
        const response = await request(server).get('/')
        //console.log(response.text)        
        expect(response.text).toBe("hola\nadiós\n")

    })
})
