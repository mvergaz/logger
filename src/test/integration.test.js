"use strict"

const fs = require('fs')
    , path = require("path")
    , request = require('supertest')
    , configFilePath = path.resolve(process.env.PWD, "config.json")
    , config = require(configFilePath)
    , logsFolder = config.find(c => c.key === "logs folder").value || 'logs'
    , logsFolderPath = path.resolve(process.env.PWD, logsFolder)
    , logsFolderTree = require('../lib/logsFolderTree')
    , logPathGenerator = require('../lib/logPathGenerator')
    , responser = require('../lib/responser')

let server

describe('service integration tests', () => {
    beforeAll(() => {
        if (!fs.existsSync(logsFolderPath))
            fs.mkdirSync(logsFolderPath)
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
        expect(response.body).toMatchObject({ message: responser.OK })
        expect(fs.readFileSync(logPathGenerated).toString()).toBe(expectedEntry)
    })

    test('expects post / to refuse entry', async () => {
        const tag = 'log', data = 'data', format = 'plain'
        const response = await request(server).post('/').send({
            tag, data, format
        })
        expect(response.body).toMatchObject({ message: responser.TAG_NOT_ALLOWED })

    })

    test('expects get /log to Match "login;data;plain"', async () => {
        const response = await request(server).get('/log')
        expect(response.text).toMatch(/login;data;plain/)
    })

    test('expects get /log/today? to Match "login;data;plain"', async () => {
        const today = new Date().toISOString().substring(0, 10)
        const response = await request(server).get('/log/' + today)        
        expect(response.text).toMatch(/login;data;plain/)
    })

    test('expects get /log/0 to return status 400', async () => {        
        const response = await request(server).get('/log/0')
        expect(response.status).toBe(400)
    })
})
