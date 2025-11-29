const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");


const userSchema = new mongoose.Schema({

    firstName: {

        type: String,
        required: true,
    },

    lastName: {

        type: String
    },

    emailId: {
        type: String,
        lowercase: true,
        required: true,

        unique: true,
        trim: true,
        validate(value) {

            if (!validator.isEmail(value)) {

                throw new Error("Invalid enalid address" + value);
            }
        },
    },

    password: {

        type: String,
        required: true,
        validate(value) {

            if (!validator.isStrongPassword(value)) {

                throw new Error("Enter a strong password:" + value)
            }
        }


    },

    age: {

        type: Number,
        min: 18

    },

    gender: {

        type: String,
        validate(value) {

            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gendewr data is not valid")


            }
        }
    },
    photoUrl: {

        type: String,
        default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_incoming&w=740&q=80",
        validate(value) {
            if (!validator.isURL(value)) {

                throw new Error("Invalid url:" + value);
            }
        },
    },

    about: {

        type: String,
        default: "This is a default about of the user",
    },
    skills: {

        type: [String]
    },




}, {

    timestamps: true,
});


//_id is also related to user
userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", { expiresIn: "1d", });

    return token;
};


//password is also realted to user
userSchema.methods.validatePassword = async function (passwordInputByUser) {

    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(

        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
