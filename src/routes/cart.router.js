import express from "express";
import { CartManger } from "../manager.js";
import { ProductManager } from "../manager.js";

const products = new ProductManager('./products.json')
const carts = new CartManger ('./carts.json')
export const cartRouter = express.Router()

cartRouter.get('/', async (req, res)=>{
    res.status(200).json({
        status: 'success',
        payload: await carts.getCarts()
    })
})


cartRouter.post('/', async (req, res)=>{
    try{
        
        const newCart = await carts.addCart({products: []})
                
        return res.status(201).json({
            status: 'success',
            payload: {
                id: newCart.id,
                products: newCart.products
            }
        })
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})


cartRouter.get('/:cid', async (req, res)=>{
    try{
        const get_carts = await carts.getCarts()
        const id_cart = req.params.cid
        const cart = get_carts.find(e => e.id == id_cart)
        
        if(!cart){
            return res.status(400).json({
                status: 'error',
                message: 'No existe ese carrito'
            })
        }

        if (cart.products.length < 1){
            res.status(200).json({
                status: 'success',
                message: 'Carrito vacio, agrega productos en cart: ' + id_cart,
                payload: cart.products
            })
        } else{
            res.status(200).json({
                status: 'success',
                payload: cart.products
            })
        }
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})


cartRouter.post('/:cid/products/:pid', async (req, res)=>{
    try{
        const get_carts = await carts.getCarts()
        const get_products = await products.getProducts()

        const cart_id = parseInt(req.params.cid)
        const product_id = parseInt(req.params.pid)

        const cart = get_carts.find(e => e.id === cart_id)

        if(!cart){
            return res.status(404).json({
                status: 'error',
                message: 'No existe ese carrito'
            })
        }

        const product = get_products.find(e => e.id = product_id)

        if(!product){
            return res.status(400).json({
                status: 'error',
                message: 'No existe ese producto'
            })
        }

        await carts.updatedCart(cart_id, product_id)

        const check_product = cart.products.find(e => e.id == product.id) || 0

        if(check_product != 0){
            res.status(200).json({
                status: 'success',
                message: 'el producto se incremento en 1 su cantidad',
            })
        } else{
            res.status(200).json({
                status: 'success',
                message: 'producto añadido al carrito',
                data: product
            })
        }
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})


cartRouter.get("*", (req, res) => {
    res.status(404).json({ 
        status: "error",
        msg: "Route not found",
        data: {} })
})
