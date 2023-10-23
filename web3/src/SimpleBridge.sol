// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract SimpleBridge is OwnerIsCreator {
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.

    event TokensTransferred(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    // Mapping to keep track of allowlisted destination chains.
    mapping(uint64 => bool) public allowlistedChains;

    IRouterClient private s_router;

    constructor(address _router) {
        s_router = IRouterClient(_router);
    }

    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (!allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @dev Updates the allowlist status of a destination chain for transactions.
    /// @notice This function can only be called by the owner.
    /// @param _destinationChainSelector The selector of the destination chain to be updated.
    /// @param allowed The allowlist status to be set for the destination chain.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

    /// @notice Bridge token to destination chain
    /// @dev The user should forward enough native tokens to cover the CCIP fees
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _token token address.
    /// @param _amount token amount.
    /// @return messageId The ID of the message that was sent.
    function bridge(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) external payable returns (bytes32) {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        return
            _transferTokens(
                _destinationChainSelector,
                _receiver,
                _token,
                _amount
            );
    }

    /// @notice Swap and then transfer token to destination chain
    /// @dev The user should forward enough native tokens to cover the CCIP fees
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _fromToken source token address.
    /// @param _toToken destination token address.
    /// @param _fromAmount source token amount.
    /// @return messageId The ID of the message that was sent.
    function swapAndBridge(
        uint64 _destinationChainSelector,
        address _receiver,
        address _fromToken,
        address _toToken,
        uint256 _fromAmount
    ) external payable returns (bytes32) {
        IERC20(_fromToken).transferFrom(msg.sender, address(this), _fromAmount);
        uint256 _toAmount = getSwapAmount(_fromToken, _toToken, _fromAmount);
        require(_toAmount != 0, "Nothing to swap");
        return
            _transferTokens(
                _destinationChainSelector,
                _receiver,
                _toToken,
                _toAmount
            );
    }

    /// @notice Get CCIP fees in native token
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _token token address.
    /// @param _amount token amount.
    /// @return the fees.
    function getBridgeFees(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) external view returns (uint256) {
        return _getFees(_destinationChainSelector, _receiver, _token, _amount);
    }

    /// @notice Get CCIP fees in native token
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _fromToken source token address.
    /// @param _toToken destination token address.
    /// @param _fromAmount source token amount.
    /// @return the fees.
    function getSwapAndBridgeFees(
        uint64 _destinationChainSelector,
        address _receiver,
        address _fromToken,
        address _toToken,
        uint256 _fromAmount
    ) external view returns (uint256) {
        uint256 _toAmount = getSwapAmount(_fromToken, _toToken, _fromAmount);
        require(_toAmount != 0, "Nothing to swap");
        return
            _getFees(_destinationChainSelector, _receiver, _toToken, _toAmount);
    }

    /// @notice Get CCIP fees in native token
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _token token address.
    /// @param _amount token amount.
    /// @return the fees.
    function _getFees(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) internal view returns (uint256) {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );

        // Get the fee required to send the message
        return s_router.getFee(_destinationChainSelector, evm2AnyMessage);
    }

    /// @notice Allows a user to provide liquidity for a token pair
    /// @dev the amount to provide for both token is the same to not impact the price
    /// @param _tokenA the address of the first token in the pair
    /// @param _tokenB the address of the other token in the pair
    function provideLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amount
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amount);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amount);
    }

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
    /// @param _beneficiary The address to which the tokens will be sent.
    /// @param _token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(_token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    /// @notice Transfer tokens to receiver on the destination chain.
    /// @notice Pay in native gas such as ETH on Ethereum or MATIC on Polgon.
    /// @notice the token must be in the list of supported tokens.
    /// @notice This function can only be called by the owner.
    /// @dev Assumes your contract has sufficient native gas like ETH on Ethereum or MATIC on Polygon.
    /// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param _receiver The address of the recipient on the destination blockchain.
    /// @param _token token address.
    /// @param _amount token amount.
    /// @return messageId The ID of the message that was sent.
    function _transferTokens(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    )
        internal
        onlyOwner
        onlyAllowlistedChain(_destinationChainSelector)
        returns (bytes32 messageId)
    {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        // address(0) means fees are paid in native gas
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _token,
            _amount,
            address(0)
        );

        // Get the fee required to send the message
        uint256 fees = s_router.getFee(
            _destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > address(this).balance)
            revert NotEnoughBalance(address(this).balance, fees);

        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(_token).approve(address(s_router), _amount);

        // Send the message through the router and store the returned message ID
        messageId = s_router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );

        // Emit an event with message details
        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(0),
            fees
        );

        // Return the message ID
        return messageId;
    }

    /// @notice Construct a CCIP message.
    /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for tokens transfer.
    /// @param _receiver The address of the receiver.
    /// @param _token The token to be transferred.
    /// @param _amount The amount of the token to be transferred.
    /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
    /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        // Set the token amounts
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), // ABI-encoded receiver address
                data: "", // No data
                tokenAmounts: tokenAmounts, // The amount and type of token being transferred
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit to 0 as we are not sending any data and non-strict sequencing mode
                    Client.EVMExtraArgsV1({gasLimit: 0, strict: false})
                ),
                // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
                feeToken: _feeTokenAddress
            });
    }

    /// @notice Get the quote for a swap
    /// @param _fromToken the source token
    /// @param _toToken the destination token
    /// @param _amount the amount to swap
    /// @return the quote
    function getSwapAmount(
        address _fromToken,
        address _toToken,
        uint256 _amount
    ) public view returns (uint256) {
        uint256 fromBalance = IERC20(_fromToken).balanceOf(address(this));
        uint256 toBalance = IERC20(_toToken).balanceOf(address(this));

        require(_amount != 0, "Insufficient amount");
        require(fromBalance != 0 && toBalance != 0, "No liquidity");

        return (_amount * toBalance) / fromBalance;
    }

    /// @notice Fallback function to allow the contract to receive Ether.
    /// @dev This function has no function body, making it a default function for receiving Ether.
    /// It is automatically called when Ether is transferred to the contract without any data.
    receive() external payable {}

    /// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
    /// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
    /// It should only be callable by the owner of the contract.
    /// @param _beneficiary The address to which the Ether should be transferred.
    function withdraw(address _beneficiary) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = address(this).balance;

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent, ) = _beneficiary.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }
}
