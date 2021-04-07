"use strict"

const router = require('express').Router()
    , fs = require('fs')    
    , post = require('./lib/post')
    , logPathGenerator = require('./lib/generateLogPath')
    , get = require('./lib/get')

module.exports = (app) => {
    app.use(require('express').json())

    router.get('/ping', (req, res) =>
        res.json({
            message: "pong"
        })
    )

    router.get('/500', (req, res) => { throw new Error("Error") })

    router.get('/log/:now?', (req, res) => {
        if (req.params.now) {
            let logFile = logPathGenerator(new Date(req.params.now))
            if (fs.existsSync(logFile))
                res.sendFile(logFile)
            else
                res.status(400).send()
        } else             
            get(res)        
    })

    router.post('/', (req, res) => {
        let msg = post(req.body.tag, req.body.data, req.body.format)
        res.json({
            message: msg
        })
    })

    app.use(router)

    app.use((err, req, res, next) => {
        let stackLines = err.stack.split("\n");
        let errMessage = stackLines[0] + "; " + stackLines[1].trim() + "\n";
        res.status(500).send(errMessage)
    })
}