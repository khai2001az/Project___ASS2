const express = require('express')
const { } = require('../dbHandler')
const router = express.Router()


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


module.exports = router;