import express from 'express'
import { ProductManager } from "../manager.js"

const products = new ProductManager('./products.json')

export const realTimeProducts = express.Router()

realTimeProducts.get('/', async(req, res)=> {
    try{
        const get_products = await products.getProducts()
        return res.render('realTimeProducts', {products: get_products})
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})

