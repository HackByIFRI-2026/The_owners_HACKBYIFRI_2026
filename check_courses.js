const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const Course = require('./backend/src/models/Course.model');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const courses = await Course.find({ type: 'PDF' }).select('title fileUrl');
        console.log('PDF Courses:');
        courses.forEach(c => {
            console.log(`- Title: ${c.title}, fileUrl: ${c.fileUrl}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
