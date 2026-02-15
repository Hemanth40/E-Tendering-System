// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TenderContract {
    struct Tender {
        uint256 id;
        string title;
        uint256 budget;
        uint256 deadline;
        address admin;
        bool isActive;
        bytes32 tenderHash;
    }

    struct Bid {
        uint256 tenderId;
        address bidder;
        uint256 amount;
        bytes32 bidHash;
        uint256 timestamp;
    }

    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => Bid[]) public tenderBids;
    mapping(uint256 => uint256) public winningBidIndex;

    uint256 public tenderCount;
    address public admin;

    event TenderCreated(uint256 indexed tenderId, address indexed admin, bytes32 tenderHash);
    event BidSubmitted(uint256 indexed tenderId, address indexed bidder, bytes32 bidHash);
    event TenderClosed(uint256 indexed tenderId);
    event WinnerDeclared(uint256 indexed tenderId, address indexed winner, uint256 winningAmount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createTender(
        string memory _title,
        uint256 _budget,
        uint256 _deadline,
        bytes32 _tenderHash
    ) public onlyAdmin returns (uint256) {
        tenderCount++;
        tenders[tenderCount] = Tender({
            id: tenderCount,
            title: _title,
            budget: _budget,
            deadline: _deadline,
            admin: msg.sender,
            isActive: true,
            tenderHash: _tenderHash
        });

        emit TenderCreated(tenderCount, msg.sender, _tenderHash);
        return tenderCount;
    }

    function submitBid(uint256 _tenderId, uint256 _amount, bytes32 _bidHash) public {
        require(tenders[_tenderId].isActive, "Tender is not active");
        require(block.timestamp < tenders[_tenderId].deadline, "Tender deadline has passed");
        require(_amount > 0, "Bid amount must be greater than 0");

        tenderBids[_tenderId].push(Bid({
            tenderId: _tenderId,
            bidder: msg.sender,
            amount: _amount,
            bidHash: _bidHash,
            timestamp: block.timestamp
        }));

        emit BidSubmitted(_tenderId, msg.sender, _bidHash);
    }

    function closeTender(uint256 _tenderId) public onlyAdmin {
        require(tenders[_tenderId].isActive, "Tender is already closed");
        tenders[_tenderId].isActive = false;
        emit TenderClosed(_tenderId);
    }

    function evaluateBids(uint256 _tenderId) public onlyAdmin returns (address winner, uint256 winningAmount) {
        require(!tenders[_tenderId].isActive, "Tender must be closed before evaluation");
        require(tenderBids[_tenderId].length > 0, "No bids submitted for this tender");

        Bid[] memory bids = tenderBids[_tenderId];
        uint256 lowestBid = bids[0].amount;
        uint256 winningIndex = 0;

        for (uint256 i = 1; i < bids.length; i++) {
            if (bids[i].amount < lowestBid) {
                lowestBid = bids[i].amount;
                winningIndex = i;
            }
        }

        winningBidIndex[_tenderId] = winningIndex;
        winner = bids[winningIndex].bidder;
        winningAmount = lowestBid;

        emit WinnerDeclared(_tenderId, winner, winningAmount);
        return (winner, winningAmount);
    }

    function getTenderBids(uint256 _tenderId) public view returns (Bid[] memory) {
        return tenderBids[_tenderId];
    }

    function getWinningBid(uint256 _tenderId) public view returns (Bid memory) {
        require(winningBidIndex[_tenderId] < tenderBids[_tenderId].length, "Winner not declared yet");
        return tenderBids[_tenderId][winningBidIndex[_tenderId]];
    }
}
