import { account, bundlerClient } from "../config";
import { contractABI, contractAddress } from "../config/abi";
import {
  BuyListing,
  CreateListing,
  Bid,
  AuctionCall,
  MintCurr,
} from "../utils/interface";

export const CreateAsset = async (asset: CreateListing) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "CreateAsset",
      to: contractAddress,
      args: [
        asset.propertyTitle,
        asset.totalUnits,
        asset.totalUnits,
        asset.category,
        asset.userAddress,
      ],
    };
    const calls = [data];
    account.userOperation = {
      estimateGas: async (userOperation) => {
        const estimate = await bundlerClient.estimateUserOperationGas(
          userOperation
        );
        // adjust preVerification upward
        estimate.preVerificationGas = estimate.preVerificationGas * 2n;
        return estimate;
      },
    };
    const userOpHash = await bundlerClient.sendUserOperation({
      account,
      calls,
      paymaster: true,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    return { success: true, result: receipt.userOpHash };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};

export const BuyPlot = async (buyplot: BuyListing) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "BuyPlot",
      to: contractAddress,
      args: [
        buyplot.tokenId,
        buyplot.purchaseAmt,
        buyplot.payAmount,
        buyplot.userAddress,
        buyplot.currencyCode,
      ],
    };
    const calls = [data];
    account.userOperation = {
      estimateGas: async (userOperation) => {
        const estimate = await bundlerClient.estimateUserOperationGas(
          userOperation
        );
        // adjust preVerification upward
        estimate.preVerificationGas = estimate.preVerificationGas * 2n;
        return estimate;
      },
    };
    const userOpHash = await bundlerClient.sendUserOperation({
      account,
      calls,
      paymaster: true,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    return { success: true, result: receipt.user };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};

export const PayBid = async (bid: Bid) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "PayBid",
      to: contractAddress,
      args: [bid.auctionId, bid.amount, bid.currencyCode, bid.userAddress],
    };
    const calls = [data];
    account.userOperation = {
      estimateGas: async (userOperation) => {
        const estimate = await bundlerClient.estimateUserOperationGas(
          userOperation
        );
        // adjust preVerification upward
        estimate.preVerificationGas = estimate.preVerificationGas * 2n;
        return estimate;
      },
    };
    const userOpHash = await bundlerClient.sendUserOperation({
      account,
      calls,
      paymaster: true,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    return { success: true, result: receipt.userOpHash };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};
export const AuctionAsset = async (auction: AuctionCall) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "AuctionAsset",
      to: contractAddress,
      args: [auction.tokenId, auction.amount, auction.userAddress],
    };
    const calls = [data];
    account.userOperation = {
      estimateGas: async (userOperation) => {
        const estimate = await bundlerClient.estimateUserOperationGas(
          userOperation
        );
        // adjust preVerification upward
        estimate.preVerificationGas = estimate.preVerificationGas * 2n;
        return estimate;
      },
    };
    const userOpHash = await bundlerClient.sendUserOperation({
      account,
      calls,
      paymaster: true,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    return { success: true, result: receipt.userOpHash };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};

export const MintCurrency = async (mint: MintCurr) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "MintCurrency",
      to: contractAddress,
      args: [mint.shortForm, mint.amount, mint.user],
    };
    const calls = [data];
    account.userOperation = {
      estimateGas: async (userOperation) => {
        const estimate = await bundlerClient.estimateUserOperationGas(
          userOperation
        );
        // adjust preVerification upward
        estimate.preVerificationGas = estimate.preVerificationGas * 2n;
        return estimate;
      },
    };
    const userOpHash = await bundlerClient.sendUserOperation({
      account,
      calls,
      paymaster: true,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    return { success: true, result: receipt.userOpHash };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};
