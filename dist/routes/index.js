"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const services_1 = require("../services");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/hello", async (_req, res) => {
    try {
        (0, console_1.log)("Hello endpoint hit");
        res.status(200).json({ message: "Hello, World!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/create-asset", async (_req, res) => {
    try {
        const { propertyTitle, totalUnits, totalUnitsNumber, category, metaId, userAddress, } = _req.body;
        var soln = await (0, services_1.CreateAsset)({
            propertyTitle,
            totalUnits,
            totalUnitsNumber,
            category,
            metaId,
            userAddress,
        });
        if (soln.success) {
            res.status(200).json({ success: true, result: soln.result });
        }
        else {
            res.status(400).json({ success: false, result: soln.result });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/buy-plot", async (_req, res) => {
    try {
        const { tokenId, purchaseAmt, payAmount, userAddress, currencyCode } = _req.body;
        var soln = await (0, services_1.BuyPlot)({
            tokenId,
            purchaseAmt,
            payAmount,
            userAddress,
            currencyCode,
        });
        if (soln.success) {
            res.status(200).json({ success: true, result: soln.result.message });
        }
        else {
            res.status(400).json({ success: false, result: soln.result });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/auction", async (_req, res) => {
    try {
        const { tokenId, amount, userAddress } = _req.body;
        var soln = await (0, services_1.AuctionAsset)({ tokenId, amount, userAddress });
        if (soln.success) {
            res.status(200).json(soln);
        }
        else {
            res.status(400).json({ success: false, result: soln.result });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/pay-bid", async (_req, res) => {
    try {
        const { auctionId, amount, currencyCode, userAddress } = _req.body;
        var soln = await (0, services_1.PayBid)({ auctionId, amount, currencyCode, userAddress });
        if (soln.success) {
            res.status(200).json({ success: true, result: soln.result });
        }
        else {
            res.status(400).json({ success: false, result: soln.result });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/mint", async (_req, res) => {
    try {
        const { shortForm, amount, user } = _req.body;
        var soln = await (0, services_1.MintCurrency)({ shortForm, amount, user });
        if (soln.success) {
            res.status(200).json({ success: true, result: soln.result });
        }
        else {
            res.status(400).json({ success: false, result: soln.result });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
