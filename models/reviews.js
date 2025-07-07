const mongoose = require('mongoose');
const dbUrl = process.env.MONGO_URL;

async function main(){
    await mongoose.connect(dbUrl);
}

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
})

module.exports = new mongoose.model("Review", reviewSchema);