import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // allows JSON request bodies

// test route
app.get("/", (req, res) => {
  res.send("Backend is alive!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
