import express from "express"
import { ProductManager } from "../manager.js"

const products = new ProductManager('./products.json')

export const productsRouter = express.Router()



productsRouter.get('/', async (req, res) => {
    try {
        const data = await products.getProducts()
        const limit = req.query.limit
        if (limit) {
            return res.status(200).json({
                status: 'success',
                payload: data.slice(0, limit)
            })
        }

        return res.status(200).json({
            status: 'success',
            payload: data
        })
    }

    catch (error) {
        res.status(500).json({ error: error.message })
    }
})

productsRouter.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const product_id = await products.getProductById(id)
        if (!product_id) {
            return res.status(404).json({ message: 'No se encontro el producto' })
        }
        return res.status(200).json({
            status: 'success',
            payload: product_id
        })
    }

    catch (error) {
        res.status(500).json({ 
            status: 'Error',
            message: error.message
         })
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const data = await products.getProducts()
    
        let new_product = req.body
        let code = data.find(e => e.code === new_product.code)
        if (code) {
            return res.status(400).json({
                status: 'error',
                message: "Error, hay un producto con el mismo codigo"
            })
        }

        const datos_obligatorios = ['title', 'description', 'price', 'code', 'stock']
        const datos_ok = datos_obligatorios.every(e => new_product[e])

        if (new_product.id == undefined && datos_ok) {
            await products.addProduct({
                ...new_product,
                status: true
            })

            res.status(201).json({
                status: 'success',
                message: 'producto guardado',
                payload: new_product
            })
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Error al guardar el producto'
            })
        }
    }

    catch (error) {
        res.status(500).json({ error: error.message })
    }
})

productsRouter.put('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        let update_product = req.body

        const product = await products.updateProduct(id, update_product)
        return res.status(201).json({
            status: 'success',
            message: 'producto acutalizado',
            payload: product
        })
    }

    catch(error){
        res.status(500).json({ error: error.message })
    }
})

productsRouter.delete('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const borrado = await products.deleteProduct(id)
        return res.status(200).json({
            status: 'success',
            message: 'producto eliminado',
            payload: borrado
        })
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})


//!---PRUEBA SI FUNCIONA HANDLE-----------------------
productsRouter.get('/:id/test', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const product_id = await products.getProductById(id)
        if (!product_id) {
            return res.status(404).json({ message: 'No se encontro el producto' })
        }
        return res.status(200).render('productsTest', product_id)
    }

    catch (error) {
        res.status(500).json({ 
            status: 'Error',
            message: error.message
         })
    }
})






