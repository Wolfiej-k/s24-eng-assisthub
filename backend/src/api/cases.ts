import { Router } from "express"

const router = Router()

router.get("/", (req, res, next) => {
  res.send("Cases API")
})

export default router
