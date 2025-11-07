import mongoose from 'mongoose'

const UserSchema=new mongoose.Schema({
    username:{type: String, required: true,unique: true},
    email:{type: String, required: true, unique:true},
    password:{type: String, sparse: true},
    auth_level:{type: String, required: true},
    stripe_customer_id:{type: String, default: null}
});
const UserModel=mongoose.model('User',UserSchema);
export default UserModel;
