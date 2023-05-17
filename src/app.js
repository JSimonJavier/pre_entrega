import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/cart.router.js";
import { __dirname } from "./utils.js";
import handlebars from 'express-handlebars'
import path from 'path'
import { productsHomeRouter } from "./routes/home.router.js";
import { Server } from "socket.io";
import { realTimeProducts } from "./routes/realtimeproducts.socket.router.js";
import { ProductManager } from "./manager.js";


const products = new ProductManager('./products.json')
const PORT = 8080
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//! port y socket--------------------------------->>
const httpServer = app.listen(PORT, () => console.log(`Server on! Listening on http://localhost:${PORT}`))

const socketServer = new Server(httpServer)
socketServer.on('connection', (socket) => {
    console.log('Nuevo canal con ID: ' + socket.id);

    socket.on('new-product', async (newProd) => {
        try {
            await products.addProduct({ ...newProd })

            const productsList = await products.getProducts()

            socketServer.emit('products', productsList)
        }
        catch (error) {
            console.log(error);
        }
    })

    socket.on('delete-product', async (idProd) => {
        try{
            
            let id = parseInt(idProd)
            await products.deleteProduct(id)
            const productsList = await products.getProducts()

            socketServer.emit('products', productsList)
            
        }
        catch(error){
            console.log(error);
        }
        
    });
});



//!__DIRNAME----------------------------->>
app.use(express.static(path.join(__dirname, 'public'))); //para utilizar __dirname, no olvidarse de importar path

//!handlebars------------------------------>>
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

//!routes res JSON ------------------------------->>
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)

//! routes handlebars html render------------------------>>
app.use("/products", productsHomeRouter)

//! routes sockets ------------------------------------>>
app.use("/realTimeProducts", realTimeProducts)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Servidor corriendo..." })
})

app.get("*", (req, res) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})