import express from "express"
import { ProductManager } from "../manager.js"

const productsHome = new ProductManager('./products.json')

export const productsHomeRouter = express.Router()

productsHomeRouter.get('/', async (req, res) => {
    try {
        const data = await productsHome.getProducts()
        
        return res.status(200).render('home', {products: data})
    }

    catch (error) {
        res.status(500).json({ error: error.message })
    }
})