const express = require('express')
const db = require("./users/model")

const server = express()

server.use(express.json())

server.get("/", (req, res) => {
    res.json({ message: "Hello, Worrld" })
})

server.get("/users", (req, res) => {
    const users = db.find()
    users.then((user) => {
        res.json(user)
    })
    .catch(() => {
        res.status(500).json({
            message: "User does not exist"
        })
    })
})

server.post("/users", (req, res) => {
    const newUser = db.insert({
        id: db.shortid,
        name: req.body.name,
        bio: req.body.bio
    })
    if (!req.body.name || !req.body.bio){
        res.status(400).json({
            message: "user name and bio required"
        })
    }
    res.status(201).json(newUser)
})

server.get("/users/:id", (req, res) => {
    const users = db.findById(req.params.id)
    users.then((user) => {
        if (req.params.id){
            res.json(user)
        } else {
            res.status(500).json({
                message: "unable to get user"
            })
        }
    })
})

server.delete("/users/:id", (req, res) => {
    const users = db.remove(req.params.id)
    users.then((user) => {
        if (req.params.id) {
            res.json(user)
        } else {
            res.status(404).json({
                message: "user gone"
            })
        }
    })
    .catch(() => {
        res.status(500).json({
            message: "user could not be deleted"
        })
    })
})

server.put("/users/:id", (req, res) => {
    const {id} = req.params
    const {name, bio} = req.body
    const users = db.update(id, req.body)
    users.then((user) => {
        if (!id) {
            res.status(404).json({
                message: "user does not exist"
            })
        } else if (!name || !bio) {
            res.status(400).json({
                message: "user name and bio required"
            })
        } else if (id && name && bio){
            res.status(200).json(user)
        }
    })
})

module.exports = server // EXPORT YOUR SERVER instead of {}
