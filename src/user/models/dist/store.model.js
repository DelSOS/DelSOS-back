"use strict";
exports.__esModule = true;
exports.StoreSchema = void 0;
var mongoose = require("mongoose");
var role_enum_1 = require("./role.enum");
exports.StoreSchema = new mongoose.Schema({
    name: { type: String },
    email: {
        type: String, required: true, lowercase: true,
        maxlength: 255,
        minlength: 6
    },
    password: { type: String, required: true },
    username: { type: String },
    role: {
        type: String,
        "default": role_enum_1.ROLE.store
    },
    lastLogin: {
        type: Date
    },
    address: {
        required: true,
        type: Array()
    }
}, { timestamps: true });
