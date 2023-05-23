const socket = io()
const formulario = document.getElementById("form-products");
const titulo = document.getElementById("form-title");
const descripcion = document.getElementById("form-description");
const precio = document.getElementById("form-price");
const codigo = document.getElementById("form-code");
const stock = document.getElementById("form-stock");
const thumbnail = document.getElementById("form-thumbnail");

socket.on('error', (err) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.msg,
      })
})

socket.on('products', (products) => {
    const productList = document.querySelector('.productListUpdated')

    productList.innerHTML = `
        ${products.map((product) => `
            <div class="card m-2" style="width: 18rem;">
                <img src=${product.thumbnail} class="card-img-top" alt=${product.title}>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">${product.price}</p>
                    <p class="card-text">${product.code}</p>
                    <p class="card-text">${product.stock}</p>
                    <button class="btn btn-danger d-grid gap-2 col-6 mx-auto" onclick="deleteProduct(${product.id})">Borrar</button>
                </div>
            </div>
        `
    ).join("")
        }`
})

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
        title: titulo.value,
        description: descripcion.value,
        price: precio.value,
        thumbnail: thumbnail.value,
        code: codigo.value,
        stock: stock.value,
    };

    titulo.value = ''
    descripcion.value = ''
    precio.value = ''
    thumbnail.value = ''
    codigo.value = ''
    stock.value = ''

    socket.emit('new-product', newProduct);
})

deleteProduct = (id) => {
    socket.emit('delete-product', id)
}
