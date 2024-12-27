import { CreateAsset } from "../services";
import { Request, Response, Router } from "express";

const router = Router();

router.post("/create-asset", async (_req: Request, res: Response) => {
  try {
   
    const { propertyTitle, totalUnits, totalUnitsNumber, category,userAddress } = _req.body
    var soln  = await CreateAsset({propertyTitle, totalUnits, totalUnitsNumber, category,userAddress});
    if (soln.success) {
        res.status(200).json({ success: true, result: soln.result });
    }
    else {
        res.status(400).json({ success: false, result: soln.result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
export default router;