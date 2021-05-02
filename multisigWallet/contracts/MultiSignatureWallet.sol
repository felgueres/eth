pragma solidity ^0.5.0;

contract MultiSignatureWallet {

    struct Transaction {
      bool executed;
      address destination;
      uint value;
      bytes data;
    }

    // The following three variables are public, meaning they can be read and will be stored for the duration of the contract.
    address[] public owners; // Array of addresses where we will store owners.
    uint public required; // Unsigned integer about the sig count required to validate transaction.
    mapping (address => bool) public isOwner; // A mapper of address to boolean to represent ownership property.

    event Deposit(address indexed sender, uint value);

    /// @dev Fallback function allows to deposit ether.
    function()
    	external
        payable
    {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
	}
    }

    // Modifier below is to 
    modifier validRequirement(uint ownerCount, uint _required){
        if ( _required > ownerCount || _required == 0 || ownerCount == 0)
            revert();
        _; // The function body is inserted inplace of the underscore.
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    constructor(address[] memory _owners, uint _required) public 
    validRequirement(_owners.length, _required) 
    {}


    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return Returns transaction ID.
    function submitTransaction(address destination, uint value, bytes memory data) public returns (uint transactionId) {}

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint transactionId) public {}

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint transactionId) public {}

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId) public {}

		/*
		 * (Possible) Helper Functions
		 */
    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint transactionId) internal view returns (bool) {}

    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return Returns transaction ID.
    function addTransaction(address destination, uint value, bytes memory data) internal returns (uint transactionId) {}
}
