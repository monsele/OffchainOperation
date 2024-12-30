export interface CreateListing {
  propertyTitle: string;
  totalUnits: bigint;
  totalUnitsNumber: bigint;
  category: number;
  metaId: number;
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
export interface MintCurr {
  shortForm: string;
  amount: bigint;
  user: string;
}

export interface TokenListedEvent {
  owner: string;
  metaid: number;
  id: bigint;
}

export interface TokenBoughtEvent {
  from: string;
  to: string;
  tokenid: bigint;
}

export interface TokenDelistedEvent {
  tokenId: bigint;
}

export interface AuctionCreatedEvent {
  auctionId: bigint;
  creator: string;
  tokenId: bigint;
  amount: bigint;
}

export interface AuctionPaidEvent {
  payer: string;
  owner: string;
  auctionId: bigint;
  amount: bigint;
}

export interface TransferSingleEvent {
  operator: string;
  from: string;
  to: string;
  id: bigint;
  value: bigint;
}

export interface TransferBatchEvent {
  operator: string;
  from: string;
  to: string;
  ids: bigint[];
  values: bigint[];
}

export interface SmartContractNumberUpdate {
  metaId: number;
  id: Number;
}
