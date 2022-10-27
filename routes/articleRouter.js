const express = require('express');
const articleRouter = express.Router();
const Article = require('../models/article');
const cool = require('cool-ascii-faces');
const article = require('../models/article');
articleRouter.get('/coolfaces', (req, res) => {
    res.send(cool())
})

articleRouter.get('/article', paginatedResults, async (req, res) => {
    res.status(200).json(res.articles)
})

articleRouter.get('/article/:id',getArticle, async (req, res) => {
    res.status(200).json(res.article)
})

articleRouter.post('/article', async (req, res) => {
    const article = await Article.create({ ...req.body })
    try {
        const newArticle = await article.save()
        res.status(201).json(newArticle)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

articleRouter.patch('/article/:id', async (req, res) => {
    try {
        id = req.params.id
        const updatedArticle = await Article.findOneAndUpdate({ _id: id}, { ...req.body }, { new: true })
        return res.status(200).json(updatedArticle)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

articleRouter.delete('/article/:id', getArticle, async (req, res) => {
    try {
        await res.article.remove()
        res.json({ message: `Article with title ${res.article.title} was deleted`})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

articleRouter.delete('/article', async (req, res) => {
    try {
        const confirmDelete = req.query.confirm == "true" ? true : false
        if (confirmDelete){
            Article.deleteMany({})
            res.json({ mesage: "All articles were deleted"})
        } else {
            res.status(400).json({message: "did not confirm to delete all articles"})
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getArticle(req, res, next) { 
    let article
    try {
        id = req.params.id
        article = await Article.findById(id)
        if (article == null){
            return res.status(404).json( { message: `An article from id ${id} Not Found`} )
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.article = article
    next()
}

async function paginatedResults(req, res, next) { 
    let articles
    
    try {
        const subject = req.query.subject ?? ""
        if (subject == "") {
            articles = await Article.find()
        }
        else {
            articles = await Article.find({ subject: subject })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    // set limit and page and subject
    const limit = parseInt(req.query.limit ?? articles.length)
    const page = parseInt(req.query.page ?? "1")

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    articles = articles.slice(startIndex, endIndex) 
    
    res.articles = articles
    next()
}

module.exports = articleRouter;
