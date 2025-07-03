const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173"],
};

require("dotenv").config();
const mongoURI = process.env.MONGO_URI;

app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(mongoURI, {
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    }
}).then(() => {
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    seedData(); // Seed data after successful connection
}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if connection fails
});

// Define Movie schema and model
const movieSchema = new mongoose.Schema({
    id: {
        type: Number, // Custom ID as a number
        required: true,
        unique: true // Ensures no duplicate IDs
    },
    title: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model("Movie", movieSchema);

// Seed initial data (optional, run once)
async function seedData() {
    try {
        const count = await Movie.countDocuments();
        if (count === 0) {
            await Movie.insertMany([
                { id: 1, title: "Orange", verdict: "HIT" },
                { id: 2, title: "RRR", verdict: "BlockBuster" },
                { id: 3, title: "Rangasthalam", verdict: "Industry Hit" },
                { id: 4, title: "Magadheera", verdict: "Historical Hit" }
            ]);
            console.log("Seeded initial movie data");
        }
    } catch (err) {
        console.error("Seed error:", err);
    }
}

app.get("/api", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json({ movies });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}).on("error", (err) => {
    console.error("Failed to start server:", err.message);
});