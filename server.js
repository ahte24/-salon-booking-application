import express from "express";
import mongoose from "mongoose";
import { User } from "./model/user.js";
import { Availability } from "./model/avalebleSlots.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isStaff, verifyToken } from "./middleware.js";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { bookingCollection } from "./model/booking.js";
dotenv.config();

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

await mongoose.connect(process.env.MONGO_URI);
const jwtSecret = process.env.JWT_KEY;

app.post("/signup", async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			isStaff: req.body.isStaff,
		});
		const result = await user.save();
		res.send("user registered");
	} catch (error) {
		res.send(error);
	}
});

app.get("/user", verifyToken, async (req, res) => {
	try {
		const userId = req.user;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.put("/user", verifyToken, async (req, res) => {
	try {
		const userId = req.user;
		// Validate and sanitize user input (optional but recommended)
		const { name, email, isStaff } = req.body;
		const user = await User.findByIdAndUpdate(
			userId,
			{ name, email, isStaff },
			{ new: true }
		);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		delete user.password;
		res.json({ message: "User updated successfully", user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.delete("/user", verifyToken, async (req, res) => {
	try {
		const userId = req.user;
		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/signin", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email }).exec();
		if (user) {
			if (await bcrypt.compare(req.body.password, user.password)) {
				const token = jwt.sign(
					{ user: user._id, isStaff: user.isStaff },
					jwtSecret,
					{ expiresIn: "24h" }
				);
				res.json({ token });
			} else {
				res.status(401).json({ message: "Invalid password" });
			}
		} else {
			res
				.status(404)
				.json({ message: "User not found. Please sign up first." });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.get("/protected", verifyToken, (req, res) => {
	res.json({ message: "this is protected route" });
});

app.post("/api/availability", verifyToken, isStaff, async (req, res) => {
	try {
		const availabilityInstance = new Availability({
			day: req.body.day,
			slots: req.body.slots.map((slot) => ({
				start: slot.start,
				end: slot.end,
				maxCapacity: slot.maxCapacity,
			})),
		});
		const savedAvailability = await availabilityInstance.save();
		res.status(201).json({
			message: "Availability set successfully",
			data: savedAvailability,
		});
	} catch (error) {
		console.error(error);
		if (error.name === "ValidationError") {
			// Handle validation errors specifically
			res.status(400).json({ error: error.message });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

app.put("/api/availability/:id", verifyToken, isStaff, async (req, res) => {
	try {
		// Find availability by ID
		const availability = await Availability.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true, // Return the updated document
			}
		);

		if (!availability) {
			return res.status(404).json({ message: "Availability not found" });
		}

		// Update successful
		res.status(200).json({
			message: "Availability updated successfully",
			data: availability,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.delete("/api/availability/:id", verifyToken, isStaff, async (req, res) => {
	try {
		const deletedAvailability = await Availability.findByIdAndDelete(
			req.params.id
		);

		if (!deletedAvailability) {
			return res.status(404).json({ message: "Availability not found" });
		}

		res.status(200).json({ message: "Availability deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/api/available-slots/:day", verifyToken, async (req, res) => {
	const { day } = req.params;
	try {
		const avalebleSlots = await Availability.findOne({ day: day });
		if (avalebleSlots) {
			res.json(avalebleSlots);
		} else {
			res.status(404).send("No slots avaleble on this day");
		}
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
});

app.post("/api/bookings", verifyToken, async (req, res) => {
	const uId = req.user;
	const avalebleSlots = await Availability.findOne({ day: req.body.day });
	try {
		if (
			req.body.numberOfBooking > 0 &&
			req.body.numberOfBooking <= avalebleSlots.slots[0].maxCapacity
		) {
			const booking = new bookingCollection({
				userId: uId,
				day: req.body.day,
				numberOfBooking: req.body.numberOfBooking,
				slots: req.body.slots.map((slot) => ({
					start: slot.start,
					end: slot.end,
				})),
			});
			const savedBooking = await booking.save();
			res.status(201).json({
				message: "Slot Booked successfully",
			});
		} else if (req.body.numberOfBooking === 0) {
			res.status(400).json({ message: "Minimum booking capacity required." });
		} else {
			res.status(400).json({
				message: "Booking capacity exceeded",
			});
		}
	} catch (error) {
		res.send(error);
	}
});

app.get("/api/bookings", verifyToken, isStaff, async (req, res) => {
	try {
		const bookedData = await bookingCollection.find({});
		if (bookedData) {
			res.json(bookedData);
		} else {
			res.status(404).send("No booking found.");
		}
	} catch (error) {
		res.send(error);
	}
});

app.put("/api/bookings/:id", verifyToken, async (req, res) => {
	try {
		const bookingId = req.params.id; // Get booking ID from URL parameter

		// Update booking (consider what fields are allowed to be updated)
		const updatedBooking = await bookingCollection.findByIdAndUpdate(
			bookingId,
			req.body, // Update with data from request body
			{ new: true } // Return the updated document
		);

		if (!updatedBooking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		res
			.status(200)
			.json({ message: "Booking updated successfully", data: updatedBooking });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
	try {
		const bookingId = req.params.id; // Get booking ID from URL parameter

		const deletedBooking = await bookingCollection.findByIdAndDelete(bookingId);

		if (!deletedBooking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		res.status(200).json({ message: "Booking deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
