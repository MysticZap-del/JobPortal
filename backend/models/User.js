import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
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
        minlength: 6
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('RegisterData', userSchema);

export default User;
