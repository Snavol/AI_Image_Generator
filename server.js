
import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Middleware
app.use(express.json());


// Test route
app.get("/test", (req, res) => {
    res.json({
        status: "success",
        message: "Backend is working!"
    });
});


// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Generate image
app.post("/generate-image", async (req, res) => {

    try {

        const category = req.body.category;

        if (!category || !category.trim()) {
            return res.status(400).json({
                error: "Please enter an image description."
            });
        }

        console.log("Generating image:", category);

        const prompt = encodeURIComponent(category);

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

        const imageBuffer = await response.arrayBuffer();

        const mimeType =
            response.headers.get("content-type") || "image/jpeg";

        if (!mimeType.startsWith("image/")) {
            throw new Error("API did not return an image.");
        }

        const imageBase64 = Buffer.from(imageBuffer).toString("base64");

        res.json({
            image: imageBase64,
            mimeType: mimeType
        });

    } catch (error) {

        console.error("Image generation failed:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


// Export Express app for Vercel
export default app;


// Start server locally
if (process.env.NODE_ENV !== "production") {

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

}
