const express = require("express");
const session = require('express-session')
const path = require('path')
const { engine } = require ('express-handlebars');
const { insertBook, getDB, updateProduct, deleteProduct, getProductById } = require('./dbHandler')
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'hbs')// khai báo sử dụng HBS để hiểu res, render
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))// lấy giữ liệu nhập từ các form
app.use(express.static('public'))
app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))


app.get('/', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('home', { data: allProducts })
});


const customerController = require('./controllers/customers');// tất cả các địa chỉ có chưa admin: localhost:5000/admin => gọi controller admin
app.use('/customers', customerController)

const productController = require('./controllers/products');// tất cả các địa chỉ có chưa product: localhost:5000/product => gọi controller admin
app.use('/products', productController)




app.get('/home', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('home', { data: allProducts })
})
app.get('/logined', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('logined', { data: allProducts })
})

app.post('/search', async (req, res) => {
    const searchInput = req.body.txtSearch;
    const dbo = await getDB()
    const allProducts = await dbo.collection("books").find({ name: searchInput }).toArray();

    res.render('logined', { data: allProducts })
})






app.get('/viewCart', (req, res) => {
    const cart = req.session["cart"]
    //Mot array chua cac san pham trong gio hang
    let spDaMua = []
    //neu khach hang da mua it nhat 1 sp
    if (cart) {
        const dict = req.session["cart"]
        for (var key in dict) {
            spDaMua.push({ tensp: key, soLuong: dict[key] })
        }
    }
    res.render('mycart', { data: spDaMua })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log(`Listening at http://localhost:${PORT}`)