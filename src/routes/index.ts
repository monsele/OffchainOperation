import {
  AuctionAsset,
  BuyPlot,
  CreateAsset,
  MintCurrency,
  PayBid,
} from "../services";
import { Request, Response, Router } from "express";

const router = Router();

router.post("/create-asset", async (_req: Request, res: Response) => {
  try {
    const {
      propertyTitle,
      totalUnits,
      totalUnitsNumber,
      category,
      metaId,
      userAddress,
    } = _req.body;
    var soln = await CreateAsset({
      propertyTitle,
      totalUnits,
      totalUnitsNumber,
      category,
      metaId,
      userAddress,
    });
    if (soln.success) {
      res.status(200).json({ success: true, result: soln.result });
    } else {
      res.status(400).json({ success: false, result: soln.result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/buy-plot", async (_req: Request, res: Response) => {
  try {
    const { tokenId, purchaseAmt, payAmount, userAddress, currencyCode } =
      _req.body;
    var soln = await BuyPlot({
      tokenId,
      purchaseAmt,
      payAmount,
      userAddress,
      currencyCode,
    });
    if (soln.success) {
      res.status(200).json({ success: true, result: soln.result });
    } else {
      res.status(400).json({ success: false, result: soln.result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/auction", async (_req: Request, res: Response) => {
  try {
    const { tokenId, amount, userAddress } = _req.body;
    var soln = await AuctionAsset({ tokenId, amount, userAddress });
    if (soln.success) {
      res.status(200).json({ success: true, result: soln.result });
    } else {
      res.status(400).json({ success: false, result: soln.result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/pay-bid", async (_req: Request, res: Response) => {
  try {
    const { auctionId, amount, currencyCode, userAddress } = _req.body;
    var soln = await PayBid({ auctionId, amount, currencyCode, userAddress });
    if (soln.success) {
      res.status(200).json({ success: true, result: soln.result });
    } else {
      res.status(400).json({ success: false, result: soln.result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/mint", async (_req: Request, res: Response) => {
  try {
    const { shortForm, amount, user } = _req.body;
    var soln = await MintCurrency({ shortForm, amount, user });
    if (soln.success) {
      res.status(200).json({ success: true, result: soln.result });
    } else {
      res.status(400).json({ success: false, result: soln.result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
