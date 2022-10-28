const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.get('/user', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: err.mesage })
    }
})

userRouter.get('/user/:email', getUserByEmail, async (req, res) => {
    res.status(200).json(res.user)
})

userRouter.post('/user', async (req, res) => {
    try {
        await User.init()
        userData = { ...req.body }
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        userData.password = hashedPassword
        const user = await User.create(userData)
        const newUser = await user.save()
        res.status(201).json({ message: "success"})
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.patch('/user/:id', async (req, res) => {
    try {
        id = req.params.id
        const update = { ...req.body, updatedAt: Date.now() }
        const updatedUser = await User.findOneAndUpdate({ _id: id}, update, { new: true })
        return res.status(200).json({ message: "success"})
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.delete('/user/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ message: `user with name ${res.user.name} was deleted`})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

userRouter.delete('/user', async (req, res) => {
    try {
        const confirmDelete = req.query.confirm == "true" ? true : false
        if (confirmDelete){
            await User.deleteMany({})
            res.json({ mesage: "All users were deleted"})
        } else {
            res.status(400).json({message: "did not confirm to delete all users"})
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next) { 
    let user
    try {
        id = req.params.id
        user = await User.findById(id)
        if (user == null) {
            return res.status(404).json( { message: `An user from id ${id} Not Found`} )
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user
    next()
}

async function getUserByEmail(req, res, next) { 
    let user
    try {
        email = req.params.email
        user = await User.findOne({ email: email })
        if (user == null) {
            return res.status(404).json( { message: `An user from email ${email} Not Found`} )
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user
    next()
}
module.exports = userRouter;
