const mongoose = require('mongoose');
async function connection() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        console.log('Connection has been created successfully');
    } catch (e) {
        console.log('Error: => ', e.message);
    }
}

connection();
