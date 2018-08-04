import bluebird from 'bluebird';
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
mongoose.Promise = bluebird;

const Schema = mongoose.Schema;

const userSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password: {
            type: String,
            required: true
        }
    }, { 
        timestamps: { 
            createdAt: "created_at", 
            updatedAt: "updated_at" 
        } 
    });


userSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

userSchema.pre("update", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function (candidatePassword) {
    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};

export const UserModel = mongoose.model('User', userSchema);

export const cleanCollection = () => UserModel.remove({}).exec();

export default UserModel;

