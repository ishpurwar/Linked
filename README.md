# 💕 Linked - Decentralized Dating Platform

A Web3 dating platform where your likes are tokens you spend and earn. Built on blockchain technology to create genuine connections through tokenized interactions and NFT profiles.

## 🚀 Platform Overview

Linked solves traditional dating app problems by introducing:
- **Tokenized Likes**: Each like costs tokens, making interactions meaningful
- **NFT Profiles**: User profiles are minted as NFTs for true ownership
- **Blockchain Verification**: Ensures authentic users and prevents spam
- **Token Economy**: Earn and spend tokens for strategic interactions
- **Chat**: messaging system

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Custom React components with glass morphism design

### Blockchain & Web3
- **Wallet Integration**: 
  - [wagmi](https://wagmi.sh) v2.16.1 - React hooks for Ethereum
  - [viem](https://viem.sh) v2.33.2 - TypeScript interface for Ethereum
  - [RainbowKit](https://www.rainbowkit.com) v2.2.8 - Wallet connection UI
  - [ConnectKit](https://docs.family.co/connectkit) v1.9.1 - Alternative wallet connector
- **Ethereum Interaction**: [ethers.js](https://ethers.org) v6.15.0
- **State Management**: [@tanstack/react-query](https://tanstack.com/query) v5.84.1

### Backend & Database
- **Database**: [Supabase](https://supabase.com) v2.53.0
  - PostgreSQL database for user profiles and metadata
  - Real-time subscriptions for chat functionality
  - Authentication and user management
- **File Storage**: [Pinata](https://pinata.cloud) v2.4.9 for IPFS image uploads

### Smart Contracts
- **Main Contract**: `0xBD82E97b14dBc96492b004e90D57abfCc22B3a4d`
- **Like Token**: `0x291dC9C4cD8Ac23614d25125BA107d66020b360e`
- **SuperLike Token**: `0xb34eb8C9964c9c429c6c10BA28B3D16a54E99420`

### Development Tools
- **Package Manager**: npm/yarn/pnpm/bun
- **Linting**: ESLint with Next.js config
- **Environment**: dotenv for configuration management

## 🏗️ Architecture

### Smart Contract Layer
```
DatingApp Contract
├── Profile Management (NFT minting)
├── Token Integration (Like/SuperLike tokens)
├── Matching Algorithm (mutual likes detection)
├── User Interactions (like, superlike, match)
└── Access Control (profile ownership)
```

### Application Layer
```
Next.js App
├── /app (App Router)
│   ├── / (Landing page)
│   ├── /createprofile (Profile creation)
│   ├── /dashboard (User dashboard)
│   ├── /match (Discovery & matching)
│   ├── /chat (Messaging interface)
│   └── /api/upload (File upload endpoint)
├── /components (Reusable UI components)
├── /lib (Utilities & configurations)
└── /utils (Helper functions)
```

### Data Flow
1. **User Authentication**: Wallet connection via wagmi/RainbowKit
2. **Profile Creation**: NFT minting + Supabase metadata storage
3. **Image Upload**: Pinata IPFS integration
4. **Matching Logic**: Smart contract mutual like detection
5. **Real-time Chat**: Supabase real-time subscriptions

## 📋 Key Features

### Core Functionality
- **Profile NFTs**: Each user profile is an ERC-721 token
- **Token Economy**: ERC-20 Like and SuperLike tokens
- **Matching System**: On-chain mutual like detection
- **Decentralized Chat**: Real-time messaging between matches
- **Image Storage**: IPFS-based profile image hosting

### User Experience
- **Responsive Design**: Mobile-first Tailwind CSS styling
- **Wallet Integration**: Seamless Web3 wallet connections
- **Real-time Updates**: Live match notifications and chat
- **Profile Discovery**: Token-based user discovery system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Web3 wallet (MetaMask, Rainbow, etc.)
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ishpurwar/Linked
cd linked
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Configure your Supabase and Pinata credentials
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Configuration

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_GATEWAY_URL=your_pinata_gateway
```



## 📚 Documentation

### Smart Contract Integration
The platform integrates with custom smart contracts for:
- User profile NFT minting
- Token-based like system
- Mutual match detection
- Decentralized identity verification

### Database Schema
Supabase PostgreSQL tables:
- `users`: User profiles and metadata
- `matches`: Match relationships
- `messages`: Chat message history
- `profiles`: Extended profile information
