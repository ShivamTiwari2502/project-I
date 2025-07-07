const mongoose = require('mongoose');
const Review = require("./reviews.js");

const dbUrl = process.env.MONGO_URL;


async function main(){
    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(dbUrl);
}

main().then(res=>{console.log("connected")})
.catch(err=>{console.log(err)});

const listingSchema = mongoose.Schema({
    title: {
        type : String,
        require : true
    },
    description:{
        type : String
    },
    image: {
        url: String,
        filename : String,
       },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Review" ,
        },
    ], 
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;