 
import { parseAbiItem, PublicClient } from "viem";
import { client } from "../config";
 import { contractAddress } from "../config/abi";
 import {
   TokenListedEvent,
   TokenBoughtEvent,
   TokenDelistedEvent,
   AuctionCreatedEvent,
   AuctionPaidEvent,
   TransferSingleEvent,
   TransferBatchEvent,
   SmartContractNumberUpdate,
 } from "../utils/interface";
 import {offchainApi} from '../config/apiConfig'
 export class EstatePoolEventService {
   private client: PublicClient;
   private static instance: EstatePoolEventService;
   private unwatchFunctions: (() => void)[] = [];

   private constructor() {
     this.client = client;
   }

   public static getInstance(): EstatePoolEventService {
     if (!EstatePoolEventService.instance) {
       EstatePoolEventService.instance = new EstatePoolEventService();
     }
     return EstatePoolEventService.instance;
   }

   public async startListening(): Promise<void> {
     try {
       // TokenListed event
       const unwatchTokenListed = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem(
           "event TokenListed(address indexed owner, uint16 indexed metaid, uint256 indexed id)"
         ),
         onLogs: this.handleTokenListedEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchTokenListed);

       // TokenBought event
       const unwatchTokenBought = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem(
           "event TokenBought(address indexed from, address indexed to, uint256 indexed tokenid)"
         ),
         onLogs: this.handleTokenBoughtEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchTokenBought);

       // TokenDelisted event
       const unwatchTokenDelisted = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem("event TokenDelisted(uint256 indexed tokenId)"),
         onLogs: this.handleTokenDelistedEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchTokenDelisted);

       // AuctionCreated event
       const unwatchAuctionCreated = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem(
           "event AuctionCreated(uint256 indexed auctionId, address indexed creator, uint256 indexed tokenId, uint256 amount)"
         ),
         onLogs: this.handleAuctionCreatedEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchAuctionCreated);

       // AuctionPaid event
       const unwatchAuctionPaid = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem(
           "event AuctionPaid(address indexed payer, address indexed owner, uint256 indexed auctionId, uint256 amount)"
         ),
         onLogs: this.handleAuctionPaidEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchAuctionPaid);

       // TransferSingle event
       const unwatchTransferSingle = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem(
           "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
         ),
         onLogs: this.handleTransferSingleEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchTransferSingle);

       // TransferBatch event
       const unwatchTransferBatch = await this.client.watchEvent({
         address: contractAddress as `0x${string}`,
         event: parseAbiItem(
           "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)"
         ),
         onLogs: this.handleTransferBatchEvents.bind(this),
       });
       this.unwatchFunctions.push(unwatchTransferBatch);

       console.log("Started listening to EstatePool events");
     } catch (error) {
       console.error("Error starting event listeners:", error);
       throw error;
     }
   }

   private async handleTokenListedEvents(logs: any[]): Promise<void> 
   {
     for (const log of logs) {
       const event: TokenListedEvent = {
         owner: log.args.owner,
         metaid: log.args.metaid,
         id: log.args.id,
       };
       const requestData: SmartContractNumberUpdate = {
         metaId: event.metaid,
         id: event.id as unknown as number,
       };
       //await offchainApi.post("/properties", requestData);
     }
   }

   private async handleTokenBoughtEvents(logs: any[]): Promise<void> {
     for (const log of logs) {
       const event: TokenBoughtEvent = {
         from: log.args.from,
         to: log.args.to,
         tokenid: log.args.tokenid,
       };
       console.log("Token Bought:", event);
       // Add your business logic here
     }
   }

   private async handleTokenDelistedEvents(logs: any[]): Promise<void> {
     for (const log of logs) {
       const event: TokenDelistedEvent = {
         tokenId: log.args.tokenId,
       };
       console.log("Token Delisted:", event);
       // Add your business logic here
     }
   }

   private async handleAuctionCreatedEvents(logs: any[]): Promise<void> {
     for (const log of logs) {
       const event: AuctionCreatedEvent = {
         auctionId: log.args.auctionId,
         creator: log.args.creator,
         tokenId: log.args.tokenId,
         amount: log.args.amount,
       };
       console.log("Auction Created:", event);
       // Add your business logic here
     }
   }

   private async handleAuctionPaidEvents(logs: any[]): Promise<void> {
     for (const log of logs) {
       const event: AuctionPaidEvent = {
         payer: log.args.payer,
         owner: log.args.owner,
         auctionId: log.args.auctionId,
         amount: log.args.amount,
       };
       console.log("Auction Paid:", event);
       // Add your business logic here
     }
   }

   private async handleTransferSingleEvents(logs: any[]): Promise<void> {
     for (const log of logs) {
       const event: TransferSingleEvent = {
         operator: log.args.operator,
         from: log.args.from,
         to: log.args.to,
         id: log.args.id,
         value: log.args.value,
       };
       console.log("Transfer Single:", event);
       // Add your business logic here
     }
   }

   private async handleTransferBatchEvents(logs: any[]): Promise<void> {
     for (const log of logs) {
       const event: TransferBatchEvent = {
         operator: log.args.operator,
         from: log.args.from,
         to: log.args.to,
         ids: log.args.ids,
         values: log.args.values,
       };
       console.log("Transfer Batch:", event);
       // Add your business logic here
     }
   }

   public async getHistoricalEvents(fromBlock: bigint, toBlock: bigint) {
     // Implementation for fetching historical events
     // Add methods for each event type you want to query historically
   }

   public stopListening(): void {
     this.unwatchFunctions.forEach((unwatch) => unwatch());
     this.unwatchFunctions = [];
     console.log("Stopped listening to EstatePool events");
   }
 }

