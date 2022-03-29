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
const async = require("hbs/lib/async");
const { all } = require("./controllers/customers");
app.use('/customers', customerController)

app.get('/insert',(req,res)=>{
    res.render('insert')
})
app.post('/insert', async (req,res)=>{
    const nameInput = req.body.txtNamebook;
    const desInput = req.body.txtDes;
    const priceInput = req.body.txtPrice;   
    const imgURLInput = req.body.imgURL;
    const newProduct = {
        name:nameInput,
        description:desInput,
        price:priceInput,
        imgURL:imgURLInput, 
        size : {dai:20, rong:40}
    }
    

    await insertBook("books", newProduct);
    res.redirect('admin')
})
app.get('/admin', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('admin', { data: allProducts })
})

app.get('/edit', async(req, res) => {
    const id = req.query.id;

    const s = await getProductById(id);
    res.render("edit", { books: s });
})
app.post('/update', async(req, res) => {
    const nameInput = req.body.txtNamebook;
    const desInput = req.body.txtDes
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.txtimgURL;
    const id = req.body.txtId;

    await updateProduct(id, nameInput, desInput, priceInput, pictureInput );
    res.redirect("admin");
})
app.get('/delete', async(req, res) => {
    const id = req.query.id;

    
    await deleteProduct(id);
    res.redirect("admin");
})

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


app.post('/sorthightolow', async (req, res) => {   
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).sort({ price : -1 }).toArray();
    res.render('logined', {data : allProducts})

});
app.post('/sortlowtohigh', async (req, res) => {   
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).sort({ price : 1 }).toArray();
    res.render('logined', {data: allProducts})

});

app.post('/addTocart', (req, res) => {
    //xem nguoi dung mua gi: Milk hay Coffee
    const product = req.body.product
    //lay gio hang trong session
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if (!cart) {
        let dict = {}
        dict[product] = 1
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    } else {
        const dict = req.session["cart"]
        //co lay product trong dict
        var oldProduct = dict[product]
        //kiem tra xem product da co trong Dict
        if (!oldProduct)
            dict[product] = 1
        else {
            dict[product] = parseInt(oldProduct) + 1
        }
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    }
    let spDaMua = []
    //neu khach hang da mua it nhat 1 sp
    const dict = req.session["cart"]
    for (var key in dict) {
        spDaMua.push({ tensp: key, soLuong: dict[key] })
    }
    res.redirect('logined')
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