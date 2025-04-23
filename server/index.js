const express = require("express");
const cors = require("cors");
const fileUploadRoutes = require("./routes/fileUploadRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files
app.use("/api", fileUploadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
