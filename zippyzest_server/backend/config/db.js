const mongoose  = require('mongoose')
const Connectdb = async() => {
    try {
       const db =  await mongoose.connect('mongodb+srv://sujaltank13:sujaltank13@cluster0.7duu8xj.mongodb.net/civico')
        console.log(`Mongodb Connected : - ${db.connection.host}`);
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = Connectdb