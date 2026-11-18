
import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.get("/", (req, res) => {
    res.sendFile(
        new URL("./public/index.html", import.meta.url).pathname
    );
});
app.use(express.static("public"));

// Generate image using Pollinations
app.post("/generate-image", async (req, res) => {

    try {

        const category = req.body.category;

        if (!category || !category.trim()) {
            return res.status(400).json({
                error: "Please enter an image description."
            });
        }

        console.log("Generating image:", category);

        // Encode the prompt
        const prompt = encodeURIComponent(category);

        // Call Pollinations API
        const response = await fetch(
            `https://gen.pollinations.ai/image/${prompt}?model=black-forest-labs/flux.1-schnell`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${process.env.POLLINATIONS_API_KEY}`
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Pollinations API error (${response.status}): ${errorText}`
            );
        }

        // Get generated image
        const imageBuffer = await response.arrayBuffer();

        const imageBase64 = Buffer.from(imageBuffer).toString("base64");

        const mimeType =
            response.headers.get("content-type") || "image/jpeg";

        if (!mimeType.startsWith("image/")) {
            throw new Error("API did not return an image.");
        }

        console.log("Image generated successfully!");

        // Send image to frontend
        res.json({
            image: imageBase64,
            mimeType: mimeType
        });

    }

    catch (error) {

        console.error("Image generation failed:", error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
