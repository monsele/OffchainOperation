"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstatePoolEventService = void 0;
const viem_1 = require("viem");
const config_1 = require("../config");
const abi_1 = require("../config/abi");
class EstatePoolEventService {
    constructor() {
        this.unwatchFunctions = [];
        this.client = config_1.client;
    }
    static getInstance() {
        if (!EstatePoolEventService.instance) {
            EstatePoolEventService.instance = new EstatePoolEventService();
        }
        return EstatePoolEventService.instance;
    }
    async startListening() {
        try {
            // TokenListed event
            const unwatchTokenListed = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event TokenListed(address indexed owner, uint16 indexed metaid, uint256 indexed id)"),
                onLogs: this.handleTokenListedEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchTokenListed);
            // TokenBought event
            const unwatchTokenBought = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event TokenBought(address indexed from, address indexed to, uint256 indexed tokenid)"),
                onLogs: this.handleTokenBoughtEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchTokenBought);
            // TokenDelisted event
            const unwatchTokenDelisted = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event TokenDelisted(uint256 indexed tokenId)"),
                onLogs: this.handleTokenDelistedEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchTokenDelisted);
            // AuctionCreated event
            const unwatchAuctionCreated = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event AuctionCreated(uint256 indexed auctionId, address indexed creator, uint256 indexed tokenId, uint256 amount)"),
                onLogs: this.handleAuctionCreatedEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchAuctionCreated);
            // AuctionPaid event
            const unwatchAuctionPaid = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event AuctionPaid(address indexed payer, address indexed owner, uint256 indexed auctionId, uint256 amount)"),
                onLogs: this.handleAuctionPaidEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchAuctionPaid);
            // TransferSingle event
            const unwatchTransferSingle = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"),
                onLogs: this.handleTransferSingleEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchTransferSingle);
            // TransferBatch event
            const unwatchTransferBatch = await this.client.watchEvent({
                address: abi_1.contractAddress,
                event: (0, viem_1.parseAbiItem)("event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)"),
                onLogs: this.handleTransferBatchEvents.bind(this),
            });
            this.unwatchFunctions.push(unwatchTransferBatch);
            console.log("Started listening to EstatePool events");
        }
        catch (error) {
            console.error("Error starting event listeners:", error);
            throw error;
        }
    }
    async handleTokenListedEvents(logs) {
        for (const log of logs) {
            const event = {
                owner: log.args.owner,
                metaid: log.args.metaid,
                id: log.args.id,
            };
            const requestData = {
                metaId: event.metaid,
                id: event.id,
            };
            //await offchainApi.post("/properties", requestData);
        }
    }
    async handleTokenBoughtEvents(logs) {
        for (const log of logs) {
            const event = {
                from: log.args.from,
                to: log.args.to,
                tokenid: log.args.tokenid,
            };
            console.log("Token Bought:", event);
            // Add your business logic here
        }
    }
    async handleTokenDelistedEvents(logs) {
        for (const log of logs) {
            const event = {
                tokenId: log.args.tokenId,
            };
            console.log("Token Delisted:", event);
            // Add your business logic here
        }
    }
    async handleAuctionCreatedEvents(logs) {
        for (const log of logs) {
            const event = {
                auctionId: log.args.auctionId,
                creator: log.args.creator,
                tokenId: log.args.tokenId,
                amount: log.args.amount,
            };
            console.log("Auction Created:", event);
            // Add your business logic here
        }
    }
    async handleAuctionPaidEvents(logs) {
        for (const log of logs) {
            const event = {
                payer: log.args.payer,
                owner: log.args.owner,
                auctionId: log.args.auctionId,
                amount: log.args.amount,
            };
            console.log("Auction Paid:", event);
            // Add your business logic here
        }
    }
    async handleTransferSingleEvents(logs) {
        for (const log of logs) {
            const event = {
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
    async handleTransferBatchEvents(logs) {
        for (const log of logs) {
            const event = {
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
    async getHistoricalEvents(fromBlock, toBlock) {
        // Implementation for fetching historical events
        // Add methods for each event type you want to query historically
    }
    stopListening() {
        this.unwatchFunctions.forEach((unwatch) => unwatch());
        this.unwatchFunctions = [];
        console.log("Stopped listening to EstatePool events");
    }
}
exports.EstatePoolEventService = EstatePoolEventService;
