const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Incorrect email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 3
    },
    university: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    linkedIn: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL');
            }
        }
    }
});

registerSchema.pre('save', async function(next){

     if (!this.isModified("password")) {
        return;
    }
    if(this.password !== this.confirmPassword){
        throw new Error('Passwords do not match');
    }

    this.password = await bcrypt.hash(this.password,10);
    this.confirmPassword = undefined;
    
})

// creating collection
const RegisterData = mongoose.model('RegisterData', registerSchema);
module.exports = RegisterData;
