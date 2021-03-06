const express = require('express')
const { checkUserRole, insertBook, getDB, deleteProduct,getProductById, updateProduct } = require('../dbHandler')
const router = express.Router()

router.get('/admin', async(req, res) => {
    const dbo = await getDB();
    const allProducts = await dbo.collection("books").find({}).toArray();
    res.render('admin', { data: allProducts })
})

router.get('/insert',(req,res)=>{
    res.render('insert')
})
router.post('/insert', async (req,res)=>{
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

router.get('/edit', async(req, res) => {
    const id = req.query.id;

    const s = await getProductById(id);
    res.render("edit", { books: s });
})
router.post('/edit', async(req, res) => {
    const nameInput = req.body.txtNamebook;
    const desInput = req.body.txtDes
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.txtimgURL;
    const id = req.body.txtId;

    await updateProduct(id, nameInput, desInput, priceInput, pictureInput );
    res.redirect("admin");
})
router.get('/delete', async(req, res) => {
    const id = req.query.id;
    await deleteProduct(id);
    res.redirect("admin");
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
        
        res.redirect('/customers/logined')
    }

})
module.exports = router;