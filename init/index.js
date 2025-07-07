const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(res=>{console.log("database connected")})
.catch(err=>{console.log(err)});

// const saveData = async=>{
//     Listing.deleteMany({});
//     Listing.insertMany(initData.data);
//     console.log("data was initialized");
// }

async function savetoDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "684f02a90c18b4e8491ea2d7" }));
    await Listing.insertMany(initData.data).then(console.log("data was removed and saved successfully"));
}
savetoDB();