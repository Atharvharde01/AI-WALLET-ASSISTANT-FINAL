// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AIWalletAssistant
 * @dev Simple smart contract for AI Wallet Assistant on HeLa Blockchain
 * @notice Store, update, and retrieve messages on-chain
 */
contract AIWalletAssistant {
    // State variables
    string public message;
    address public owner;
    uint256 public messageCount;
    
    // Events
    event MessageUpdated(address indexed sender, string newMessage, uint256 timestamp);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /**
     * @dev Constructor - sets initial message and owner
     */
    constructor(string memory _initialMessage) {
        message = _initialMessage;
        owner = msg.sender;
        messageCount = 0;
        emit MessageUpdated(msg.sender, _initialMessage, block.timestamp);
    }

    /**
     * @dev Update the stored message
     * @param _newMessage The new message to store
     */
    function updateMessage(string memory _newMessage) public {
        require(bytes(_newMessage).length > 0, "Message cannot be empty");
        require(bytes(_newMessage).length <= 280, "Message too long (max 280 chars)");
        
        message = _newMessage;
        messageCount++;
        
        emit MessageUpdated(msg.sender, _newMessage, block.timestamp);
    }

    /**
     * @dev Get the current message
     * @return The stored message
     */
    function getMessage() public view returns (string memory) {
        return message;
    }

    /**
     * @dev Get the total number of message updates
     * @return The message count
     */
    function getMessageCount() public view returns (uint256) {
        return messageCount;
    }

    /**
     * @dev Transfer ownership
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnerChanged(oldOwner, _newOwner);
    }
}
