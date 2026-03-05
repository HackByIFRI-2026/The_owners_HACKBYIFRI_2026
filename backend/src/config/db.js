const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log(`Connecting to MongoDB at: ${uri}`);
        const conn = await mongoose.connect(uri);
        console.log(`[OK] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[FAIL] Erreur de connexion MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
