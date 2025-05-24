const mongoose = require('mongoose');



    const ItemsSchema = new mongoose.Schema({
        Name : {type:String, required: true},
        Price: {type:String, required: true},
        Description: {type:String, required: true},
        Category: {type:String, required: true},
        SellerID : {type:String, required: true},
        
    })

const ItemsModel = mongoose.model("ItemsModel",ItemsSchema)

module.exports = ItemsModel