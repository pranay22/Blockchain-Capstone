pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";
import "./verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is Verifier, ERC721Mintable {
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        address to;
        uint256 tokenId;
        bytes32 keyId;
        bool exists;
        uint256 minted;
    }

    uint256 private solutionCount;
    // TODO define an array of the above struct
    mapping(uint256 => Solution) private _solutions;
    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => uint256) private key2token;

    modifier SolutionExists(uint256 tokenId) {
        require(_solutions[tokenId].exists == true, "No Solution provided");
        _;
    }
    modifier AddressCorrect(address to, uint256 tokenId) {
        require(_solutions[tokenId].to == to, "invalid Address provided");
        _;
    }

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 generatedId, uint256 tokenId, address owner);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        address to,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public returns (bytes32) {
        Verifier.Proof memory proof = Verifier.Proof(
            Pairing.G1Point(a[0], a[1]),
            Pairing.G2Point(b[0], b[1]),
            Pairing.G1Point(c[0], c[1])
        );
        bool validProof = verifyTx(proof, input);
        require(validProof == true, "Proof is not valid");
        bytes32 keyId = keccak256(
            abi.encodePacked(
                to,
                tokenId,
                a[0],
                a[1],
                b[0],
                b[1],
                c[0],
                c[1],
                input
            )
        );

        require(_solutions[tokenId].exists == false, "Solution exists");
        key2token[keyId] = tokenId;
        _solutions[tokenId] = Solution(to, tokenId, keyId, true, 0);
        solutionCount = solutionCount + 1;
        emit SolutionAdded(keyId, tokenId, to);
        return keyId;
    }

    function tokenSolution(bytes32 keyId) external view returns (uint256) {
        return key2token[keyId];
    }

    function SolutionKeyId(address to, uint256 tokenId)
        external
        view
        SolutionExists(tokenId)
        AddressCorrect(to, tokenId)
        returns (bytes32)
    {
        return _solutions[tokenId].keyId;
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(
        address to,
        uint256 tokenId,
        bytes32 keyId
    )
        public
        SolutionExists(tokenId)
        AddressCorrect(to, tokenId)
        returns (uint256)
    {
        require(
            tokenId == key2token[keyId],
            "KeyId doesn't match with tokenId"
        );

        _solutions[tokenId].minted = _solutions[tokenId].minted++;
        super.mint(to, tokenId);
        return key2token[keyId];
    }
}
