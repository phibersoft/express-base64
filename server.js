const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();

app.use(express.text({ limit: "10mb" }));

const uploadsDir = path.join(__dirname, "uploads");

const setup = async () => {
  try {
    await fs.access(uploadsDir);
  } catch (error) {
    await fs.mkdir(uploadsDir);
  }
};

const slugify = (text) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-");
};

setup();

app.post("/", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send("No image provided");
    }

    const matches = req.body.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).send("Invalid base64 format");
    }

    const mimeType = matches[1];
    const imageData = matches[2];

    const extension = mimeType.split("/")[1];

    let filename;

    if (req.headers["x-filename"]) {
      filename = `${slugify(req.headers["x-filename"])}.${extension}`;
    } else {
      filename = `image_${Date.now()}.${extension}`;
    }
    const filepath = path.join(uploadsDir, filename);

    await fs.writeFile(filepath, imageData, "base64");
    console.log(`Image saved: ${filename}`);
    res.send(`Image saved: ${filename}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
