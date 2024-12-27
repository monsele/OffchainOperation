export interface CreateListing {
  propertyTitle: string;
  totalUnits: bigint;
  totalUnitsNumber: bigint;
  category: number;
  userAddress: string;
}

export interface BuyListing {
  tokenId: bigint;
  purchaseAmt: bigint;
  payAmount: bigint;
  userAddress: string;
  currencyCode: string;
}

export interface Bid {
  auctionId: bigint;
  amount: bigint;
  currencyCode: string;
  userAddress: string;
}
export interface AuctionCall {
  tokenId: bigint;
  amount: bigint;
  userAddress: string;
}
