const express = require('express')



const { insertUser, checkUserRole, insertBook, getDB, deleteProduct,getProductById, updateProduct } = require('../dbHandler')
const router = express.Router()

router.post('/search', async (req, res) => {
    const searchInput = req.body.txtSearch;
    const dbo = await getDB()
    const allProducts = await dbo.collection("books").find({ name: searchInput }).toArray();

    res.render('logined', { data: allProducts })
})

router.get('/viewCart', (req, res) => {
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

//neu request la: /admin
router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register', (req,res)=>{
    const name = req.body.txtName
    const role = req.body.Role
    const pass= req.body.txtPassword
    const objectToInsert = {
        userName: name,
        role:role,
        password: pass
    }
    insertUser("Users",objectToInsert)
    res.render('login') 

    
})



router.get('/sorthightolow',(req,res)=>{
    res.render('logined')
})
router.post('/sorthightolow', async (req, res) => {   
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).sort({ price : -1 }).toArray();
    res.render('logined', {data : allProducts})

});
router.get('/sortlowtohigh',(req,res)=>{
    res.render('logined')
})
router.post('/sortlowtohigh', async (req, res) => {   
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).sort({ price : 1 }).toArray();
    res.render('logined', {data: allProducts})

});


router.get('/addTocart',(req,res)=>{
    res.render('logined')
})  

router.post('/addTocart', (req, res) => {
    //xem nguoi dung mua gi: Milk hay Coffee
    const product = req.body.product
    //lay bien cart trong session [co the chua co gia tri hoac co gia tri]
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if (!cart) {
        let dict = {}
        dict[product] = 1
        req.session["cart"] = dict
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
    }
    //chuyen gia tri tu dict sang array
    let spDaMua = []
    //neu khach hang da mua it nhat 1 sp
    const dict = req.session["cart"]
    for (var key in dict) {
        spDaMua.push({ tensp: key, soLuong: dict[key] })
    }
    res.redirect('logined')
})


router.get('/home', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.redirect('home', { data: allProducts })
})

router.get('/logined', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('logined', { data: allProducts })
})

//Submit add User

module.exports = router;