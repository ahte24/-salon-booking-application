import mongoose from "mongoose";
const { Schema } = mongoose;

const availabilitySchema = new mongoose.Schema({
	day: String,
	slots: [
		{
			start: String, // Format: "HH:MM"
			end: String, // Format: "HH:MM"
			maxCapacity: Number,
		},
	],
});

// Create Mongoose model
export const Availability = mongoose.model("Availability", availabilitySchema);
