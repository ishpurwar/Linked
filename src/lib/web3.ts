import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './constants';

export interface ProfileData {
  name: string;
  age: number;
  interests: string;
  uri: string[]; // Changed to array of image URLs
}

export class DatingAppContract {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, contractAbi, signer);
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