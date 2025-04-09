// Backend: Node.js with Express
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { writeToPath } = require("fast-csv");

const app = express();
app.use(cors());
app.use(express.json());

// Simple login simulation
const USERS = [{ username: "admin", password: "Admin@Pin2025" }];
const port = const PORT = process.env.PORT || 8000;

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.post("/generate-csv", (req, res) => {
    const { boardName, imageUrls, titles, descriptions, destinationUrls, thumbnails, publishDates, keywords } = req.body;

    if (!(imageUrls.length === titles.length && titles.length === descriptions.length && descriptions.length === destinationUrls.length)) {
        return res.status(400).json({ error: "All input lists must have the same length." });
    }
    // Get current date and time for filename
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    const fileName = `pins_${formattedDate}-${formattedTime}.csv`;
    const outputFile = fileName;
    const headers = ["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"];
    const rows = imageUrls.map((url, index) => [
        titles[index],
        url,
        boardName,
        thumbnails && thumbnails[index] ? thumbnails[index] : "",
        descriptions[index],
        destinationUrls[index],
        publishDates && publishDates[index] ? publishDates[index] : "",
        keywords && keywords[index] ? keywords[index] : ""
    ]);

    writeToPath(outputFile, [headers, ...rows], { headers: false })
        .on("finish", () => res.download(outputFile))
        .on("error", (err) => res.status(500).json({ error: err.message }));
});

app.listen(port, () => console.log(`server running on port ${port}`));

