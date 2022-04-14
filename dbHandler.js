
const {MongoClient,ObjectId} = require('mongodb');

const URL = 'mongodb+srv://khaidb:Ditmemay0909@cluster0.rjzex.mongodb.net/test';
const DATABASE_NAME = "khaiDB"

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function insertBook(collectionName, documentToInsert){
    const dbo = await getDB();
    await dbo.collection(collectionName).insertOne(documentToInsert);
}



async function insertUser(collectionName,userToInsert){
    const dbo = await getDB();
    const newObject = await dbo.collection(collectionName).insertOne(userToInsert);
    console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function updateProduct(id, nameInput,desImput, priceInput, pictureInput) {
    const filter = { _id: ObjectId(id) };
    const newValue = { $set: { name: nameInput,description:desImput, price: priceInput, imgURL: pictureInput } };

    const dbo = await getDB();
    await dbo.collection("books").updateOne(filter, newValue);
}

async function search(condition, collectionName) {
    const dbo = await getDB();
    //const searchCondition = new RegExp(condition, 'i')
    var results = await dbo.collection(collectionName).
    find(condition).toArray();
    return results;
}


async function getProductById(id) {
    const dbo = await getDB();
    const s = await dbo.collection("books").findOne({ _id: ObjectId(id) });
    return s;
}


async function deleteProduct(id) {
    const dbo = await getDB();
    await dbo.collection("books").deleteOne({ "_id": ObjectId(id) });
}

async function checkUserRole(nameI,passI){
    const dbo = await getDB();
    const user= await dbo.collection("Users").findOne({userName:nameI,password:passI});
//vào trong database dùng findone để tìm một bản ghi gồm có username và password 
//nếu không trùng thì sẽ return - 1 còn nếu có thì sẽ return admin hoặc customers
    if (user==null) {
        return "-1"
    }else{
        console.log(user)
        return user.role;
    }
}
const USERTABLE = 'Users';
const BOOK_TABLE = 'books';
const ORDER_TABLE = 'Order';
const ORDERDETAIL_TABLE = 'OrderDetail';


module.exports = {insertUser,checkUserRole, insertBook, getDB, updateProduct, deleteProduct, getProductById,search, USERTABLE, BOOK_TABLE, ORDER_TABLE, ORDERDETAIL_TABLE}