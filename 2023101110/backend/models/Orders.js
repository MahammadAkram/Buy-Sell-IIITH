const mongoose= require('mongoose')


const OrdersSchema= new mongoose.Schema({
    ItemID: {type: String, required: true},
    BuyerID: {type:String, required:true},
    SellerID:{type:String, required:true},
    Amount:{type:String, required:true},
    HashedOTP:{type:String},
    Status:{type:String}
})





const OrdersModel = mongoose.model("OrdersModel",OrdersSchema)

module.exports = OrdersModel