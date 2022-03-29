const express = require('express')



const { insertUser, checkUserRole, insertBook, getDB } = require('../dbHandler')
const router = express.Router()

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

router.get('/login', (req,res)=>{
    res.render('login')
})

//check thông tin login
router.post('/login',async (req,res) =>{
    const name = req.body.txtName
    const pass= req.body.txtPass
    const role = await checkUserRole(name, pass)
    if (role == "-1"){
        res.render('login')
        return
        
    }else if(role == "admin"){
        res.redirect('admin')
        return
    }else{
        console.log("you are: " + role)
        req.session["User"] = {
            'userName': name,
            'role': role //admin hoặc customers
        }
        
        res.redirect('logined')
    }

})

router.get('/insert',(req,res)=>{
    res.render('insert')
})
router.post('/insert', async (req,res)=>{
    const nameInput = req.body.txtNamebook;
    const desInput = req.bode.txtDes;
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

router.get('/admin', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('admin', { data: allProducts })
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