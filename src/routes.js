"use strict"
const router = require('express').Router()
module.exports = (app) => {
    app.use(require('express').json())

    router.get('/ping', (req, res) =>
        res.json({
            message: "pong"
        })
    )

    router.get('/500', (req, res) => { throw new Error("Error") })

    app.use(router)

    app.use((err, req, res, next) => {        
        const stackLines = err.stack.split("\n");
        const errMessage = stackLines[0] + "; " + stackLines[1].trim() + "\n";
        res.status(500).send(errMessage)
    })
}