// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interfaces for the ERC-20 tokens (since they are in separate files)
interface ILikeToken {
    function mint(address to, uint256 amount) external;
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transferOwnership(address newOwner) external;
    function decimals() external view returns (uint8);
}

interface ISuperLikeToken {
    function mint(address to, uint256 amount) external;
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transferOwnership(address newOwner) external;
    function decimals() external view returns (uint8);
}

// Main DatingApp contract (now with ERC-721 NFTs for profiles)
contract DatingApp is ERC721URIStorage, Ownable {
    // Struct for user profiles (minimal data, linked to NFT tokenId)
    struct Profile {
        string name;
        uint256 age;
        string interests; // e.g., "hiking,music"
        string uri; // IPFS URI for NFT metadata (stored in struct for easy access, but URI is also in ERC721URIStorage)
        address owner; // Owner of the profile NFT
    }

    // ERC-20 Token Interfaces
    ILikeToken public likeToken;
    ISuperLikeToken public superLikeToken;

    // Mappings and counters
    mapping(uint256 => Profile) public profiles; // tokenId => Profile
    mapping(address => uint256) public userToTokenId; // User address => their tokenId
    mapping(address => mapping(address => bool)) private hasLiked; // Tracks if A has liked B (for mutual check)
    mapping(address => mapping(address => bool)) private hasSuperLiked; // Tracks if A has super liked B
    mapping(address => address[]) public incomingLikes; // Who has liked this user (regular only)
    mapping(address => address[]) public outgoingLikes; // Whom this user has liked (regular only)
    mapping(address => address[]) public mutualMatches; // Mutual likes (matches)
    mapping(address => address[]) public incomingSuperLikes; // NEW: Who has super-liked this user
    mapping(address => address[]) public outgoingSuperLikes; // NEW: Whom this user has super-liked
    mapping(address => address[]) public mutualSuperMatches; // NEW: Mutual super likes (matches)
    uint256 private nextTokenId = 1; // Auto-incrementing tokenId for NFTs
    uint256 public totalProfiles = 0; // Total number of profiles (updated on creation)

    // Events
    event ProfileCreated(address user, uint256 tokenId, string name);
    event LikeSent(address from, address to);
    event SuperLikeSent(address from, address to);
    event MatchCreated(address user1, address user2);
    event SuperMatchCreated(address user1, address user2); // NEW: For mutual super likes

    // Constructor: Takes addresses of pre-deployed LikeToken and SuperLikeToken
    constructor(address _likeTokenAddress, address _superLikeTokenAddress) ERC721("DatingProfileNFT", "DPNFT") Ownable(msg.sender) {
        likeToken = ILikeToken(_likeTokenAddress);
        superLikeToken = ISuperLikeToken(_superLikeTokenAddress);
    }

    // Create a profile: Mint an NFT and store profile data, mint free tokens
    function createProfile(
        string memory _name,
        uint256 _age,
        string memory _interests,
        string memory _uri
    ) external {
        require(userToTokenId[msg.sender] == 0, "Profile already exists");
        
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId); // Mint NFT to user
        _setTokenURI(tokenId, _uri); // Set NFT URI (now supported via ERC721URIStorage)
        
        profiles[tokenId] = Profile({
            name: _name,
            age: _age,
            interests: _interests,
            uri: _uri,
            owner: msg.sender
        });
        userToTokenId[msg.sender] = tokenId;
        totalProfiles++; // Increment total count
        
        // Mint 100 free LikeTokens and SuperLikeTokens to the new user
        likeToken.mint(msg.sender, 100 * 10**likeToken.decimals());
        superLikeToken.mint(msg.sender, 100 * 10**superLikeToken.decimals());
        
        emit ProfileCreated(msg.sender, tokenId, _name);
    }

    // Get a list of all user addresses on the platform
    function getAllUsers() external view returns (address[] memory) {
        address[] memory users = new address[](totalProfiles);
        for (uint256 i = 1; i <= totalProfiles; i++) {
            users[i - 1] = ownerOf(i); // Get owner of each tokenId (assumes sequential IDs starting from 1)
        }
        return users;
    }

    // Send a regular like: Transfer 1 LikeToken to the target
    function likeUser(address _to) external {
        require(userToTokenId[msg.sender] != 0, "Create your profile first");
        require(userToTokenId[_to] != 0, "Target user has no profile");
        require(msg.sender != _to, "Cannot like yourself");
        require(!hasLiked[msg.sender][_to], "Already liked this user");

        // Transfer 1 LikeToken from sender to _to
        likeToken.transferFrom(msg.sender, _to, 1 * 10**likeToken.decimals());
        
        hasLiked[msg.sender][_to] = true;
        incomingLikes[_to].push(msg.sender); // Track incoming like
        outgoingLikes[msg.sender].push(_to); // Track outgoing like
        emit LikeSent(msg.sender, _to);

        // Check for mutual like
        if (hasLiked[_to][msg.sender]) {
            mutualMatches[msg.sender].push(_to);
            mutualMatches[_to].push(msg.sender);
            emit MatchCreated(msg.sender, _to);
        }
    }

    // Send a super like: Transfer 1 SuperLikeToken to the target (UPDATED: Now tracks incoming/outgoing and mutuals)
    function superLikeUser(address _to) external {
        require(userToTokenId[msg.sender] != 0, "Create your profile first");
        require(userToTokenId[_to] != 0, "Target user has no profile");
        require(msg.sender != _to, "Cannot super like yourself");
        require(!hasSuperLiked[msg.sender][_to], "Already super liked this user");

        // Transfer 1 SuperLikeToken from sender to _to
        superLikeToken.transferFrom(msg.sender, _to, 1 * 10**superLikeToken.decimals());
        
        hasSuperLiked[msg.sender][_to] = true;
        incomingSuperLikes[_to].push(msg.sender); // NEW: Track incoming super like
        outgoingSuperLikes[msg.sender].push(_to); // NEW: Track outgoing super like
        emit SuperLikeSent(msg.sender, _to);

        // NEW: Check for mutual super like
        if (hasSuperLiked[_to][msg.sender]) {
            mutualSuperMatches[msg.sender].push(_to);
            mutualSuperMatches[_to].push(msg.sender);
            emit SuperMatchCreated(msg.sender, _to);
        }
    }

    // Get profile details by tokenId
    function getProfileByTokenId(uint256 tokenId) external view returns (Profile memory) {
        return profiles[tokenId];
    }

    // Get list of users who have liked you (regular likes only)
    function getIncomingLikes() external view returns (address[] memory) {
        return incomingLikes[msg.sender];
    }

    // Get list of users whom you have liked (regular likes only)
    function getOutgoingLikes() external view returns (address[] memory) {
        return outgoingLikes[msg.sender];
    }

    // Get list of mutual matches
    function getMutualMatches() external view returns (address[] memory) {
        return mutualMatches[msg.sender];
    }

    // NEW: Get list of users who have super-liked you
    function getIncomingSuperLikes() external view returns (address[] memory) {
        return incomingSuperLikes[msg.sender];
    }

    // NEW: Get list of users whom you have super-liked
    function getOutgoingSuperLikes() external view returns (address[] memory) {
        return outgoingSuperLikes[msg.sender];
    }

    // NEW: Get list of mutual super matches
    function getMutualSuperMatches() external view returns (address[] memory) {
        return mutualSuperMatches[msg.sender];
    }
}