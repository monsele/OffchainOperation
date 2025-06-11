"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintCurrency = exports.AuctionAsset = exports.PayBid = exports.BuyPlot = exports.CreateAsset = void 0;
const config_1 = require("../config");
const abi_1 = require("../config/abi");
const apiConfig_1 = require("../config/apiConfig");
const CreateAsset = async (asset) => {
    try {
        const data = {
            abi: abi_1.contractABI,
            functionName: "CreateAsset",
            to: abi_1.contractAddress,
            args: [
                asset.propertyTitle,
                asset.totalUnits,
                asset.totalUnits,
                asset.category,
                asset.metaId,
                asset.userAddress,
            ],
        };
        const calls = [data];
        config_1.account.userOperation = {
            estimateGas: async (userOperation) => {
                const estimate = await config_1.bundlerClient.estimateUserOperationGas(userOperation);
                // adjust preVerification upward
                estimate.preVerificationGas = estimate.preVerificationGas * 2n;
                return estimate;
            },
        };
        const userOpHash = await config_1.bundlerClient.sendUserOperation({
            account: config_1.account,
            calls,
            paymaster: true,
        });
        const receipt = await config_1.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
        });
        var userClient = config_1.client;
        var metadata = await userClient.readContract({
            address: abi_1.contractAddress,
            abi: abi_1.contractABI,
            functionName: "getMetaMapping",
            args: [asset.metaId],
        });
        var formattedData = {
            MetaId: metadata.MetaId,
            Id: metadata.Id.toString(),
        };
        console.log(formattedData);
        const requestData = {
            metaId: metadata.MetaId,
            id: Number(formattedData.Id),
        };
        var resp = await apiConfig_1.offchainApi.post("/contractNumber", requestData);
        return { success: true, result: receipt.receipt.transactionHash };
    }
    catch (error) {
        console.error(error);
        return { success: false, result: error };
    }
};
exports.CreateAsset = CreateAsset;
const BuyPlot = async (buyplot) => {
    try {
        const data = {
            abi: abi_1.contractABI,
            functionName: "BuyPlot",
            to: abi_1.contractAddress,
            args: [
                buyplot.tokenId,
                buyplot.purchaseAmt,
                buyplot.payAmount,
                buyplot.userAddress,
                buyplot.currencyCode,
            ],
        };
        const calls = [data];
        config_1.account.userOperation = {
            estimateGas: async (userOperation) => {
                const estimate = await config_1.bundlerClient.estimateUserOperationGas(userOperation);
                // adjust preVerification upward
                estimate.preVerificationGas = estimate.preVerificationGas * 2n;
                return estimate;
            },
        };
        const userOpHash = await config_1.bundlerClient.sendUserOperation({
            account: config_1.account,
            calls,
            paymaster: true,
        });
        const receipt = await config_1.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
        });
        return { success: true, result: receipt.receipt.transactionHash };
    }
    catch (error) {
        console.error(error);
        return { success: false, result: error };
    }
};
exports.BuyPlot = BuyPlot;
const PayBid = async (bid) => {
    try {
        const data = {
            abi: abi_1.contractABI,
            functionName: "PayBid",
            to: abi_1.contractAddress,
            args: [bid.auctionId, bid.amount, bid.currencyCode, bid.userAddress],
        };
        const calls = [data];
        config_1.account.userOperation = {
            estimateGas: async (userOperation) => {
                const estimate = await config_1.bundlerClient.estimateUserOperationGas(userOperation);
                // adjust preVerification upward
                estimate.preVerificationGas = estimate.preVerificationGas * 2n;
                return estimate;
            },
        };
        const userOpHash = await config_1.bundlerClient.sendUserOperation({
            account: config_1.account,
            calls,
            paymaster: true,
        });
        const receipt = await config_1.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
        });
        return { success: true, result: receipt.receipt.transactionHash };
    }
    catch (error) {
        console.error(error);
        return { success: false, result: error };
    }
};
exports.PayBid = PayBid;
const AuctionAsset = async (auction) => {
    try {
        const data = {
            abi: abi_1.contractABI,
            functionName: "AuctionAsset",
            to: abi_1.contractAddress,
            args: [auction.tokenId, auction.amount, auction.userAddress],
        };
        const calls = [data];
        config_1.account.userOperation = {
            estimateGas: async (userOperation) => {
                const estimate = await config_1.bundlerClient.estimateUserOperationGas(userOperation);
                // adjust preVerification upward
                estimate.preVerificationGas = estimate.preVerificationGas * 2n;
                return estimate;
            },
        };
        const userOpHash = await config_1.bundlerClient.sendUserOperation({
            account: config_1.account,
            calls,
            paymaster: true,
        });
        const receipt = await config_1.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
        });
        var userClient = config_1.client;
        var auctionCounter = await userClient.readContract({
            address: abi_1.contractAddress,
            abi: abi_1.contractABI,
            functionName: "getAuctionCounter",
            args: [],
        });
        console.log(auctionCounter);
        return {
            success: true,
            result: receipt.receipt.transactionHash,
            auctionCounter: Number(auctionCounter),
        };
    }
    catch (error) {
        console.error(error);
        return { success: false, result: error };
    }
};
exports.AuctionAsset = AuctionAsset;
const MintCurrency = async (mint) => {
    try {
        const data = {
            abi: abi_1.contractABI,
            functionName: "mintCurrency",
            to: abi_1.contractAddress,
            args: [mint.shortForm, mint.amount, mint.user],
        };
        const calls = [data];
        config_1.account.userOperation = {
            estimateGas: async (userOperation) => {
                const estimate = await config_1.bundlerClient.estimateUserOperationGas(userOperation);
                // adjust preVerification upward
                estimate.preVerificationGas = estimate.preVerificationGas * 2n;
                return estimate;
            },
        };
        const userOpHash = await config_1.bundlerClient.sendUserOperation({
            account: config_1.account,
            calls,
            paymaster: true,
        });
        const receipt = await config_1.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
        });
        return { success: true, result: receipt.receipt.transactionHash };
    }
    catch (error) {
        console.error(error);
        return { success: false, result: error };
    }
};
exports.MintCurrency = MintCurrency;
