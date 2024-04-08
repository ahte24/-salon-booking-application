import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
	},
	isStaff: {
		type: Boolean,
		default: false,
	},
});

export const User = mongoose.model("User", UserSchema);
