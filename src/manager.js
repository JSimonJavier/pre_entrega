import fs from "fs"

export class ProductManager {
    constructor(path) {
        this.path = path
    }


    async addProduct(obj) {
        try {
            const data = await this.getProducts()
            let id;

            //! tiene que estar las siguientes prop
            if (
                !obj.title ||
                !obj.description ||
                !obj.price ||
                !obj.thumbnail ||
                !obj.stock ||
                !obj.code
            ) {
                return "Falto un dato"
            }

            if (data.length === 0) {
                id = 1
            } else {
                id = data[data.length - 1].id + 1
            }

            //! si tiene el mismo codigo
            const codes = data.map((product) => product.code)
            if (codes.includes(obj.code)) {
                return `Codigo existente ${obj.code}`;
            }

            const add_product = { id, ...obj }
            data.push(add_product)
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
            return add_product
        }

        catch (error) {
            throw new Error(error.message)
        }
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(data);
            }

            await fs.promises.writeFile(this.path, JSON.stringify([]));
            return [];
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductById(id) {
        try {
            let data = await this.getProducts();
            const product_id = data.find((product) => product.id === id);

            if (!product_id) {
                throw new Error("producto no existe");
            }

            return product_id;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(id, newObj) {
        try {
            let data = await this.getProducts();
            const index = data.findIndex((product) => product.id === id);

            if (index === -1) {
                throw new Error(
                    "No se encuentra el producto a acutalizar con id: " + id
                );
            }

            data[index] = { ...data[index], ...newObj };

            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
            return data[index];
        }

        catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(id) {
        try {
            let data = await this.getProducts();
            const index = data.findIndex((product) => product.id === id);
            const delete_product = data.find(e => e.id === id)
            if (index === -1) {
                throw new Error("no se encuentra el id " + id);
            }

            data.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');

            return delete_product;
        } catch (error) {
            throw new Error(error);
        }
    }
}


export class CartManger {
    constructor(path) {
        this.path = path
    }

    async addCart(obj) {
        try {
            const data = await this.getCarts()
            let id
            data.length === 0 ? (id = 1) : (id = data[data.length - 1].id + 1)
            const new_cart = { id, ...obj }
            data.push(new_cart)
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
            return new_cart
        }
        catch (error) {
            throw new Error('Algo salio mal')
        }
    }

    async getCarts() {
        try {
            if (!fs.existsSync('carts.json')) {
                fs.writeFileSync('carts.json', "[]", "utf-8");
                return []
            } else {
                const read = await fs.promises.readFile(this.path, "utf-8");
                const data = read ? JSON.parse(read) : [];
                return data
            }
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

    async getCartById(id) {
        try {
            const data = await this.getCarts()
            const data_by_id = data.find(e => e.id === id)
            if (!data_id) {
                throw new Error("no existe");
            }

            return data_by_id
        }
        catch (error) {
            throw new Error('Algo salio mal')
        }
    }

    async updatedCart(cartId, productId) {
        try {
            const dataCarts = await this.getCarts() //llamamos al carrito
            const read = await fs.promises.readFile("./products.json", "utf-8"); //llamamos a los productos que tenemos en json
            const dataProducts = read ? JSON.parse(read) : []; //obtemos los producto como codigo gracias al parse
            const cart = dataCarts.find(element => element.id == cartId) //al carrito que obtuve estoy buscando el mismo id que pido
            const productFound = {
                id: dataProducts.find(ele => ele.id == productId).id //estoy buscando los productos con el mismo id que pido
            }

            const cartProducts = cart.products //me devuelve products: []

            if (cartProducts.find(ele => ele.id == productFound.id)) { //si esta vacio no entra y sale del if y suma en cantidad 1 y lo pushe en el propiedad products, si tiene algo entra y suma esa cantidad en uno si el id es igual al de product
                productFound.quantity++
                cartProducts.find(ele => ele.id == productFound.id).quantity++
                await fs.promises.writeFile(this.path, JSON.stringify(dataCarts, null, 2), "utf-8");
                return cartProducts
            }

            productFound.quantity = 1
            cart.products.push(productFound)

            await fs.promises.writeFile(this.path, JSON.stringify(dataCarts, null, 2), "utf-8");

        }
        catch (error) {
            throw new Error('Algo salio mal')
        }
    }

    async deleteCart(id) {
        try {
            let data = await this.getCarts();
            const index = data.findIndex(cart => cart.id === id);

            if (index === -1) {
                throw new Error("no se encuentra el id " + id);
            }

            data.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');

            return "carrito eliminado";
        }
        catch (error) {
            throw new Error('Algo salio mal')
        }
    }
}


