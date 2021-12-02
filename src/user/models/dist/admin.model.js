"use strict";
exports.__esModule = true;
exports.AdminSchema = void 0;
var mongoose = require("mongoose");
var role_enum_1 = require("./role.enum");
exports.AdminSchema = new mongoose.Schema({
    email: {
        type: String, required: true, lowercase: true,
        maxlength: 255,
        minlength: 6
    },
    password: { type: String, required: true },
    username: { type: String },
    role: {
        type: String,
        "default": role_enum_1.ROLE.admin
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });