// server/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
if (!MONGO_URI) {
  console.error("[server] Missing MONGODB_URI in .env");
  process.exit(1);
}

// ----- Schemas -----
const HabitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    kind: { type: String, enum: ["good", "bad"], required: true },
    targetDays: { type: Number, required: true, min: 1 },
    startDate: { type: String, required: true }, // yyyy-mm-dd
    daysChecked: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
    order: { type: Number, default: () => Date.now() }, // higher = earlier in list
  },
  { timestamps: true }
);

const TodoItemSchema = new mongoose.Schema(
  { text: { type: String, required: true }, done: { type: Boolean, default: false } },
  { _id: true }
);

const TodoGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: "#e0f2fe" },
    items: { type: [TodoItemSchema], default: [] },
    pinned: { type: Boolean, default: false },
    order: { type: Number, default: () => Date.now() },
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", HabitSchema);
const TodoGroup = mongoose.model("TodoGroup", TodoGroupSchema);

// ----- Normalizers -----
function normHabit(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    name: o.name,
    kind: o.kind,
    targetDays: o.targetDays,
    startDate: o.startDate,
    daysChecked: Array.isArray(o.daysChecked) ? o.daysChecked.slice() : [],
    pinned: !!o.pinned,
    order: typeof o.order === "number" ? o.order : (o.createdAt ? +new Date(o.createdAt) : Date.now()),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
function normGroup(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    name: o.name,
    color: o.color || "#e0f2fe",
    items: (o.items || []).map((it) => ({
      id: String(it._id),
      text: it.text,
      done: !!it.done,
    })),
    pinned: !!o.pinned,
    order: typeof o.order === "number" ? o.order : (o.createdAt ? +new Date(o.createdAt) : Date.now()),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

// ----- Routes -----
app.get("/api/ping", (_req, res) => res.json({ ok: true, message: "pong", time: new Date().toISOString() }));

// HABITS
app.get("/api/habits", async (_req, res) => {
  try {
    const docs = await Habit.find().sort({ pinned: -1, order: -1, createdAt: -1 });
    res.json(docs.map(normHabit));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to list habits" }); }
});

app.post("/api/habits", async (req, res) => {
  try {
    const { name, kind, targetDays, startDate } = req.body || {};
    if (!name || !kind || !targetDays || !startDate) return res.status(400).json({ error: "Missing required fields" });
    const doc = await Habit.create({ name, kind, targetDays, startDate, daysChecked: [] });
    res.status(201).json(normHabit(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to create habit" }); }
});

app.patch("/api/habits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, kind, targetDays, startDate, pinned, order } = req.body || {};
    const update = {};
    if (typeof name === "string") update.name = name;
    if (kind === "good" || kind === "bad") update.kind = kind;
    if (Number.isFinite(targetDays)) update.targetDays = targetDays;
    if (typeof startDate === "string") update.startDate = startDate;
    if (typeof pinned === "boolean") update.pinned = pinned;
    if (Number.isFinite(order)) update.order = order;
    const doc = await Habit.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(normHabit(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to update habit" }); }
});

app.patch("/api/habits/:id/days", async (req, res) => {
  try {
    const { id } = req.params;
    const { daysChecked } = req.body || {};
    if (!Array.isArray(daysChecked)) return res.status(400).json({ error: "daysChecked must be array" });
    const doc = await Habit.findByIdAndUpdate(id, { daysChecked }, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(normHabit(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to set days" }); }
});

app.patch("/api/habits/:id/toggle-today", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Habit.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    const day = new Date().toISOString().slice(0, 10);
    const set = new Set(doc.daysChecked);
    set.has(day) ? set.delete(day) : set.add(day);
    doc.daysChecked = [...set];
    await doc.save();
    res.json(normHabit(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to toggle today" }); }
});

app.delete("/api/habits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Habit.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to delete habit" }); }
});

// GROUPS
app.get("/api/groups", async (_req, res) => {
  try {
    const docs = await TodoGroup.find().sort({ pinned: -1, order: -1, createdAt: -1 });
    res.json(docs.map(normGroup));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to list groups" }); }
});

app.post("/api/groups", async (req, res) => {
  try {
    const { name, color } = req.body || {};
    if (!name) return res.status(400).json({ error: "Missing name" });
    const doc = await TodoGroup.create({ name, color: color || "#e0f2fe", items: [] });
    res.status(201).json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to create group" }); }
});

app.patch("/api/groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, pinned, order } = req.body || {};
    const update = {};
    if (typeof name === "string") update.name = name;
    if (typeof color === "string") update.color = color;
    if (typeof pinned === "boolean") update.pinned = pinned;
    if (Number.isFinite(order)) update.order = order;
    const doc = await TodoGroup.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to update group" }); }
});

// Back-compat color endpoint
app.patch("/api/groups/:id/color", async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.body || {};
    const doc = await TodoGroup.findByIdAndUpdate(id, { color }, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to set group color" }); }
});

app.delete("/api/groups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await TodoGroup.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to delete group" }); }
});

app.post("/api/groups/:id/erase-completed", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await TodoGroup.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    doc.items = (doc.items || []).filter((it) => !it.done);
    await doc.save();
    res.json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to erase completed items" }); }
});

app.post("/api/groups/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "Missing text" });
    const doc = await TodoGroup.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    doc.items.unshift({ text, done: false });
    await doc.save();
    res.json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to add item" }); }
});

app.patch("/api/groups/:id/items/:itemId/toggle", async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const doc = await TodoGroup.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    const it = doc.items.id(itemId);
    if (!it) return res.status(404).json({ error: "Item not found" });
    it.done = !it.done;
    await doc.save();
    res.json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to toggle item" }); }
});

app.delete("/api/groups/:id/items/:itemId", async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const doc = await TodoGroup.findById(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    const it = doc.items.id(itemId);
    if (!it) return res.status(404).json({ error: "Item not found" });
    it.deleteOne();
    await doc.save();
    res.json(normGroup(doc));
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to delete item" }); }
});

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[mongo] connected");
    app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`));
  } catch (e) {
    console.error("[server] Failed to start:", e);
    process.exit(1);
  }
})();
