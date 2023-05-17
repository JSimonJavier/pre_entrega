const socket = io()
const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputThumbnail = document.getElementById("form-thumbnail");

//escuchamos el servidor
socket.on('products', (data) =>{
    renderProducts(data)
})

const renderProducts = async (products) => {
    try {
        const response = await fetch("/realTimeProducts");
        const serverTemplate = await response.text();
        const template = Handlebars.compile(serverTemplate);
        const html = template({ products });
        document.getElementById("productList").innerHTML = html;
    } catch (error) {
        console.log(error);
    }
}

formProducts.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
        title: inputTitle.value,
        description: inputDescript.value,
        price: inputPrice.value,
        thumbnail: inputThumbnail.value,
        code: inputCode.value,
        stock: inputStock.value,
    };
    socket.emit('new-product', newProduct);
})