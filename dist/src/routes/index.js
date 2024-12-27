"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/create-asset", async (_req, res) => {
    try {
        const { propertyTitle, totalUnits, totalUnitsNumber, category, userAddress } = _req.body;
        var soln = await (0, services_1.CreateAsset)({ propertyTitle, totalUnits, totalUnitsNumber, category, userAddress });
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
