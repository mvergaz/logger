"use strict"

const router = require('express').Router()
    , fs = require('fs')
    , post = require('./lib/post')
    , logPathGenerator = require('./lib/generateLogPath')
    , getRecursiveLogs = require('./lib/getRecursiveTreeLogs')

module.exports = (app) => {
    app.use(require('express').json())

    router.get('/ping', (req, res) =>
        res.json({
            message: "pong"
        })
    )

    router.get('/500', (req, res) => { throw new Error("Error") })

    router.get('/:now?', (req, res) => {
        if (req.params.now) {
            const path = logPathGenerator(req.params.now)
            if (fs.existsSync(path))
                res.sendFile(path)
            else
                res.status(400).send()
        } else {
            console.log('Recursive!')
            getRecursiveLogs(res)
        }
    })

    router.post('/', (req, res) => {
        const msg = post(req.body.tag, req.body.data, req.body.format)
        res.json({
            message: msg
        })
    })

    app.use(router)

    app.use((err, req, res, next) => {
        const stackLines = err.stack.split("\n");
        const errMessage = stackLines[0] + "; " + stackLines[1].trim() + "\n";
        res.status(500).send(errMessage)
    })
}