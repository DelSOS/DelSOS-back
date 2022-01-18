import { ROLE, STATUS } from '../../utils/enum';
import * as mongoose from 'mongoose';
import { Exclude } from 'class-transformer';

export const ShopperSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      lowercase: true,
      maxlength: 255,
      minlength: 6,
    },
    password: { type: String, select: false },
    username: { type: String },
    age: { type: Number },
    phoneNumber: { type: String },
    role: {
      type: String,
      default: ROLE.shopper,
    },

    lastLogin: {
      type: Date,
    },
    birthdate: {
      type: Date,
    },
    bankDetails: {
      owner: { type: String, default: '' },
      cardNumber: { type: String, default: '' },
      expirationDate: { type: Date, default: new Date() },
    },

    // range in kilometer where the shopper can deliver
    range: { type: Number, default: 0 },

    address: { type: String, default: '' },

    status: {
      type: String,
      default: STATUS.deactivated,
    },
  },
  { timestamps: true },
);

export class Shopper extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  password: string;
  age: number;
  phoneNumber: string;
  role: string;
  bankDetails: Object;
  range: Array<number>;
  address: string;
  status: string;
}
