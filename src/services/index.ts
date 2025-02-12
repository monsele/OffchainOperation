import { PublicClient } from "viem";
import { account, bundlerClient, client } from "../config";
import { contractABI, contractAddress } from "../config/abi";
import {
  BuyListing,
  CreateListing,
  Bid,
  AuctionCall,
  MintCurr,
  SmartContractNumberUpdate,
} from "../utils/interface";
import { offchainApi } from "../config/apiConfig";

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
        asset.metaId,
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

    var userClient = client as PublicClient;
    var metadata = await userClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "getMetaMapping",
      args: [asset.metaId],
    });
    var formattedData = {
      MetaId: metadata.MetaId as unknown as number,
      Id: metadata.Id.toString(),
    };
    console.log(formattedData);

    const requestData: SmartContractNumberUpdate = {
      metaId: metadata.MetaId as unknown as number,
      id: Number(formattedData.Id),
    };

    var resp = await offchainApi.post("/contractNumber", requestData);

    return { success: true, result: receipt.receipt.transactionHash };
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

    return { success: true, result: receipt.receipt.transactionHash };
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
    return { success: true, result: receipt.receipt.transactionHash };
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
    var userClient = client as PublicClient;
    var auctionCounter = await userClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "getAuctionCounter",
      args: [],
    });
    console.log(auctionCounter);
    

    return {
      success: true,
      result: receipt.receipt.transactionHash,
      auctionCounter: Number(auctionCounter),
    };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};

export const MintCurrency = async (mint: MintCurr) => {
  try {
    const data = {
      abi: contractABI,
      functionName: "mintCurrency",
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
    return { success: true, result: receipt.receipt.transactionHash };
  } catch (error) {
    console.error(error);
    return { success: false, result: error };
  }
};
