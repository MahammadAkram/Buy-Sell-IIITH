const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const EmployeeSchema = new mongoose.Schema({
    FirstName : {type:String, required: true},
    LastName: {type:String, required: true},
    Email: {type:String, required: true},
    Age: {type:Number, required: true},
    ContactNumber: {type:Number, required: true},
    Password: {type:String, required: true},
    Cart : [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "ItemsModel"
    }]



})

EmployeeSchema.pre('save', async function (next) {
    const employee = this;
    if (employee.isModified('Password') || employee.isNew) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(employee.Password, saltRounds);
            employee.Password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


const EmployeeModel = mongoose.model("EmployeeModel",EmployeeSchema)

module.exports = EmployeeModel