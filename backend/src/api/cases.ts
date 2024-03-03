import { Router } from "express"

const router = Router()

router.get("/", (_, res, __) => {
  res.send("Cases API")
})

export default router
