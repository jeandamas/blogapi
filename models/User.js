const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        require: [true, "Please enter password"],
        minlength: [6, "Minimun password length is 6 characters"],
    },
    registration_date: {
        type: Date,
        default: Date.now,
    },
});

// HASH PASSWORD by Adding a pre-save hook to the User model
UserSchema.pre("save", async function (next) {
    // Generate a salt for the user's password
    const salt = await bcrypt.genSalt();
    // Hash the user's password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    // Call the next middleware function
    next();
});

// STATIC METHOD TO LOGIN USER
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Wrong Email or Password");
    }
    throw Error("Wrong Email or Password");
};

module.exports = mongoose.model("User", UserSchema);
