const mongoose = require('mongoose');
const config = require('../config/env.config');

const connectDB = async() => {
    try{
        const db_connection = await mongoose.connect(config.mongoUri);
        console.log(`mongoDB Connected : ${db_connection.connection.host}`)

    }catch(error){
        console.error(`Database error : ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;