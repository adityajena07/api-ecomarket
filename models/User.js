import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
        type: String,
        enum: ["seller", "processing"],
        required: true
    },

    businessName: { type: String, required: true },

    address: { type: String, required: true },

    /* ================= PROCESSING LOGIC ================= */

    category: {
        type: String,
        default: null
    },

    /* ================= PREMIUM SYSTEM ================= */

    isPremium: {
        type: Boolean,
        default: false
    },

    subscriptionType: {
        type: String,
        enum: ["Monthly", "Yearly", null],
        default: null
    },

    /* ================= AUTH ================= */

    otp: String,
    otpExpiry: Date,

    isVerified: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

/* ================= PASSWORD HASH ================= */

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();

});

/* ================= MATCH PASSWORD ================= */

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);