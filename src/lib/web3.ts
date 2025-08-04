import { ethers } from 'ethers';
import { contractAbi, contractAddress, erc20Abi, likeTokenAddress, superLikeTokenAddress } from './constants';

export interface ProfileData {
  name: string;
  age: number;
  interests: string;
  uri: string[]; // Changed to array of image URLs
}

export class DatingAppContract {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;
  private likeTokenContract: ethers.Contract;
  private superLikeTokenContract: ethers.Contract;

  constructor(signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, contractAbi, signer);
    this.likeTokenContract = new ethers.Contract(likeTokenAddress, erc20Abi, signer);
    this.superLikeTokenContract = new ethers.Contract(superLikeTokenAddress, erc20Abi, signer);
  }

  async createProfile(profileData: ProfileData): Promise<ethers.TransactionResponse> {
    try {
      // Convert array of URIs to JSON string for storage
      const uriData = JSON.stringify(profileData.uri);
      
      const tx = await this.contract.createProfile(
        profileData.name,
        profileData.age,
        profileData.interests,
        uriData
      );
      return tx;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async getProfileByTokenId(tokenId: number) {
    try {
      const profile = await this.contract.getProfileByTokenId(tokenId);
      
      // Parse URI data back to array
      let uriData: string[];
      try {
        uriData = JSON.parse(profile.uri);
      } catch {
        // Fallback for old single URI format
        uriData = [profile.uri];
      }
      
      return {
        name: profile.name,
        age: profile.age.toString(),
        interests: profile.interests,
        uri: uriData,
        owner: profile.owner,
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async getUserTokenId(address: string): Promise<number> {
    try {
      const tokenId = await this.contract.userToTokenId(address);
      return tokenId.toString();
    } catch (error) {
      console.error('Error getting user token ID:', error);
      throw error;
    }
  }

  // Token-related functions
  async getLikeTokenBalance(address: string): Promise<string> {
    try {
      const balance = await this.likeTokenContract.balanceOf(address);
      const decimals = await this.likeTokenContract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting like token balance:', error);
      throw error;
    }
  }

  async getSuperLikeTokenBalance(address: string): Promise<string> {
    try {
      const balance = await this.superLikeTokenContract.balanceOf(address);
      const decimals = await this.superLikeTokenContract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting super like token balance:', error);
      throw error;
    }
  }

  async approveLikeTokens(amount: string = "1000000"): Promise<ethers.TransactionResponse> {
    try {
      const decimals = await this.likeTokenContract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);
      const tx = await this.likeTokenContract.approve(contractAddress, amountInWei);
      return tx;
    } catch (error) {
      console.error('Error approving like tokens:', error);
      throw error;
    }
  }

  async approveSuperLikeTokens(amount: string = "1000000"): Promise<ethers.TransactionResponse> {
    try {
      const decimals = await this.superLikeTokenContract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);
      const tx = await this.superLikeTokenContract.approve(contractAddress, amountInWei);
      return tx;
    } catch (error) {
      console.error('Error approving super like tokens:', error);
      throw error;
    }
  }

  async checkLikeTokenAllowance(userAddress: string): Promise<string> {
    try {
      const allowance = await this.likeTokenContract.allowance(userAddress, contractAddress);
      const decimals = await this.likeTokenContract.decimals();
      return ethers.formatUnits(allowance, decimals);
    } catch (error) {
      console.error('Error checking like token allowance:', error);
      throw error;
    }
  }

  async checkSuperLikeTokenAllowance(userAddress: string): Promise<string> {
    try {
      const allowance = await this.superLikeTokenContract.allowance(userAddress, contractAddress);
      const decimals = await this.superLikeTokenContract.decimals();
      return ethers.formatUnits(allowance, decimals);
    } catch (error) {
      console.error('Error checking super like token allowance:', error);
      throw error;
    }
  }

  async likeUser(targetAddress: string): Promise<ethers.TransactionResponse> {
    try {
      const tx = await this.contract.likeUser(targetAddress);
      return tx;
    } catch (error) {
      console.error('Error liking user:', error);
      throw error;
    }
  }

  async superLikeUser(targetAddress: string): Promise<ethers.TransactionResponse> {
    try {
      const tx = await this.contract.superLikeUser(targetAddress);
      return tx;
    } catch (error) {
      console.error('Error super liking user:', error);
      throw error;
    }
  }

  async getIncomingLikes(): Promise<string[]> {
    try {
      const likes = await this.contract.getIncomingLikes();
      return likes;
    } catch (error) {
      console.error('Error getting incoming likes:', error);
      throw error;
    }
  }

  async getOutgoingLikes(): Promise<string[]> {
    try {
      const likes = await this.contract.getOutgoingLikes();
      return likes;
    } catch (error) {
      console.error('Error getting outgoing likes:', error);
      throw error;
    }
  }

  async getMutualMatches(): Promise<string[]> {
    try {
      const matches = await this.contract.getMutualMatches();
      return matches;
    } catch (error) {
      console.error('Error getting mutual matches:', error);
      throw error;
    }
  }

  async getIncomingSuperLikes(): Promise<string[]> {
    try {
      const superLikes = await this.contract.getIncomingSuperLikes();
      return superLikes;
    } catch (error) {
      console.error('Error getting incoming super likes:', error);
      throw error;
    }
  }

  async getOutgoingSuperLikes(): Promise<string[]> {
    try {
      const superLikes = await this.contract.getOutgoingSuperLikes();
      return superLikes;
    } catch (error) {
      console.error('Error getting outgoing super likes:', error);
      throw error;
    }
  }

  async getMutualSuperMatches(): Promise<string[]> {
    try {
      const superMatches = await this.contract.getMutualSuperMatches();
      return superMatches;
    } catch (error) {
      console.error('Error getting mutual super matches:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<string[]> {
    try {
      const users = await this.contract.getAllUsers();
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async getTotalProfiles(): Promise<number> {
    try {
      const total = await this.contract.totalProfiles();
      return Number(total);
    } catch (error) {
      console.error('Error getting total profiles:', error);
      throw error;
    }
  }
}

export const createDatingAppContract = (signer: ethers.JsonRpcSigner) => {
  return new DatingAppContract(signer);
};