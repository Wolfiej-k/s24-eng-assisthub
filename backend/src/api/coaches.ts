import { Router } from "express"
import { CoachModel, type Coach } from "../schemas/coach.js"
const router = Router();

router.get("/", async (_req, res) => {
  const items = await CoachModel.find();
  res.status(200).json(items);
})

router.post("/", async(req, res) => {
  const { name, email } = req.body as Coach;
  const item = new CoachModel({
    name: name,
    email: email,
  })

  try {
    await item.save();
    res.status(201).json(item);
  } catch {
    res.status(400).json({ error: "Validation failed" });
  }
})

router.get("/:id", async (req, res) => {
  try {
    const item = await CoachModel.findById(req.params.id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch {
    res.status(404).json({ error: "Not found" });
  }
})

router.patch("/:id", async (req, res) => {
  try {
    const item = await CoachModel.findById(req.params.id);
    if (item) {
      const { name, email } = req.body as Coach;
      item.name = name ?? item.name;
      item.email = email ?? item.email;

      try {
        await item.save();
        res.status(201).json(item);
      } catch {
        res.status(400).json({ error: "Validation failed" });
      }
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch {
    res.status(404).json({ error: "Not found" });
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await CoachModel.deleteOne({ _id: req.params.id });
    res.status(204).json()
  }
  catch {
    res.status(404).json({ error: "Not found" });
  }
})

export default router;
