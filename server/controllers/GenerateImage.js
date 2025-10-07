import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate",
      {
        engine: "stable-diffusion-v1",
        prompt: prompt,
        width: 512,
        height: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Correct extraction
    const imageBase64 = response.data.image;

    if (!imageBase64) {
      return res.status(500).json({ error: "No image returned from API" });
    }

    res.status(200).json({ photo: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error(
      "Stability API Error:",
      error.response?.data || error.message
    );
    const errMsg =
      error.response?.data?.message || error.response?.data || error.message;
    res.status(500).json({ error: errMsg });
  }
};
