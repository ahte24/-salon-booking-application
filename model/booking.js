import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new mongoose.Schema({
	userId: String,
	day: String,
	numberOfBooking: Number,
	slots: [
		{
			start: String, // Format: "HH:MM"
			end: String, // Format: "HH:MM"
		},
	],
});

// Create Mongoose model
export const bookingCollection = mongoose.model(
	"bookingCollection",
	bookingSchema
);
