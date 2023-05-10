import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartRouter } from "./routes/cart.router.js";

const PORT = 8080

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => console.log(`Server on! Listening on http://localhost:${PORT}`))


app.get("/", (req, res) =>{
    res.status(200).json({message:"Servidor corriendo..."})
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)


app.get("*", (req, res) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})