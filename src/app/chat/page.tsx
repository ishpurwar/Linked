"use client";

import { useWeb3 } from "../../lib/Web3Provider";
import { useEffect, useState, useRef } from "react";
import {
  checkUserExists,
  Message,
  sendMessage,
  getMessages,
  subscribeToMessages,
} from "../../lib/supabase";
import { createDatingAppContract } from "@/lib/web3";
import Link from "next/link";

interface Contact {
  address: string;
  profile: any;
  tokenId: number | null;
  type: "match" | "super_match";
  unreadCount?: number;
  lastMessage?: {
    text: string;
    timestamp: Date;
    from: string;
  };
}

export default function ChatPage() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [userExists, setUserExists] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkExists = async (account: string) => {
      if (account) {
        try {
          const user = await checkUserExists(account);
          setUserExists(!!user);
        } catch (error) {
          console.error("Error checking user existence:", error);
          setUserExists(false);
        }
      } else {
        setUserExists(false);
      }
    };

    if (account) {
      checkExists(account);
    }
  }, [account]);

  useEffect(() => {
    if (signer) {
      setContract(createDatingAppContract(signer));
    }
  }, [signer]);

  // Load contacts from mutual matches and super matches
  useEffect(() => {
    const loadContacts = async () => {
      if (!contract || !userExists) return;

      setLoading(true);
      try {
        const allContacts: Contact[] = [];

        // Get mutual matches
        const mutualMatches = await contract.getMutualMatches();
        if (mutualMatches && Array.isArray(mutualMatches)) {
          for (const userAddress of mutualMatches) {
            try {
              const tokenId = await contract.getUserTokenId(userAddress);
              const profile = await contract.getProfileByTokenId(
                Number(tokenId)
              );

              allContacts.push({
                address: userAddress,
                profile,
                tokenId: Number(tokenId),
                type: "match",
                unreadCount: Math.floor(Math.random() * 5), // Mock unread count
                lastMessage: {
                  text: "Hey! How are you doing?",
                  timestamp: new Date(Date.now() - Math.random() * 86400000),
                  from: userAddress,
                },
              });
            } catch (error) {
              console.error(
                `Error fetching profile for ${userAddress}:`,
                error
              );
              allContacts.push({
                address: userAddress,
                profile: null,
                tokenId: null,
                type: "match",
                unreadCount: 0,
              });
            }
          }
        }

        // Get mutual super matches
        const mutualSuperMatches = await contract.getMutualSuperMatches();
        if (mutualSuperMatches && Array.isArray(mutualSuperMatches)) {
          for (const userAddress of mutualSuperMatches) {
            try {
              const tokenId = await contract.getUserTokenId(userAddress);
              const profile = await contract.getProfileByTokenId(
                Number(tokenId)
              );

              allContacts.push({
                address: userAddress,
                profile,
                tokenId: Number(tokenId),
                type: "super_match",
                unreadCount: Math.floor(Math.random() * 3), // Mock unread count
                lastMessage: {
                  text: "Super match! ✨",
                  timestamp: new Date(Date.now() - Math.random() * 43200000),
                  from: userAddress,
                },
              });
            } catch (error) {
              console.error(
                `Error fetching profile for ${userAddress}:`,
                error
              );
              allContacts.push({
                address: userAddress,
                profile: null,
                tokenId: null,
                type: "super_match",
                unreadCount: 0,
              });
            }
          }
        }

        // Sort contacts by last message timestamp
        allContacts.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp.getTime() || 0;
          const bTime = b.lastMessage?.timestamp.getTime() || 0;
          return bTime - aTime;
        });

        setContacts(allContacts);
      } catch (error) {
        console.error("Error loading contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [contract, userExists]);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    if (!searchTerm) return true;

    const profileName = contact.profile?.name?.toLowerCase() || "";
    const address = contact.address.toLowerCase();
    const search = searchTerm.toLowerCase();

    return profileName.includes(search) || address.includes(search);
  });

  // Get total unread count
  const totalUnreadCount = contacts.reduce(
    (sum, contact) => sum + (contact.unreadCount || 0),
    0
  );

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold gradient-text mb-6">
              Connect Your Wallet
            </h1>
            <p className="text-gray-300 mb-8">
              You need to connect your wallet to access your chats.
            </p>
            <button
              onClick={connectWallet}
              className="btn-purple text-white px-8 py-4 rounded-xl text-xl font-semibold"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userExists) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">👤</div>
            <h1 className="text-4xl font-bold gradient-text mb-6">
              Create Your Profile First
            </h1>
            <p className="text-gray-300 mb-8">
              You need to create a profile before accessing chats.
            </p>
            <Link
              href="/createprofile"
              className="btn-purple text-white px-8 py-4 rounded-xl text-xl font-semibold inline-block"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              💬 Chat Room
            </h1>
            {totalUnreadCount > 0 && (
              <div className="bg-purple-600 text-white text-sm px-2 py-1 rounded-full">
                {totalUnreadCount} unread
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Contacts Sidebar */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-300">Loading contacts...</span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💔</div>
                <p className="text-gray-400">
                  {searchTerm
                    ? "No contacts found"
                    : "No matches to chat with yet"}
                </p>
                {!searchTerm && (
                  <Link
                    href="/match"
                    className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Find your first match →
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredContacts.map((contact, index) => (
                    
                  <div
                    key={`${contact.address}-${index}`}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-700 ${
                      selectedContact?.address === contact.address
                        ? "bg-gray-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Profile Picture */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {contact.profile?.name?.[0]?.toUpperCase() ||
                              contact.address.slice(2, 4).toUpperCase()}
                          </span>
                        </div>
                        {/* Match Type Badge */}
                        <div className="absolute -top-1 -right-1">
                          {contact.type === "super_match" ? (
                            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs">
                              ⭐
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-xs">
                              💕
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold truncate">
                            {contact.profile?.name ||
                              `User ${contact.address.slice(-4)}`}
                          </h3>
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                              {contact.unreadCount}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-400 text-sm truncate">
                          {contact.lastMessage?.text ||
                            "Start a conversation..."}
                        </p>

                        {contact.lastMessage && (
                          <p className="text-gray-500 text-xs mt-1">
                            {formatTimeAgo(contact.lastMessage.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedContact.profile?.name?.[0]?.toUpperCase() ||
                        selectedContact.address.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">
                      {selectedContact.profile?.name ||
                        `User ${selectedContact.address.slice(-4)}`}
                    </h2>
                    {/* <p className="text-gray-400 text-sm flex items-center gap-2">
                      {selectedContact.type === "super_match" ? (
                        <>
                          <span>⭐</span>
                          Super Match
                        </>
                      ) : (
                        <>
                          <span>💕</span>
                          Mutual Match
                        </>
                      )}
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 bg-gray-900 flex flex-col">
                {account && (
                  <EmbeddedChat
                    currentUserAddress={account}
                    otherUserAddress={selectedContact.address}
                  />
                )}
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Select a contact to start chatting
                </h2>
                <p className="text-gray-400 mb-8">
                  Choose someone from your matches to begin a conversation
                </p>
                {contacts.length === 0 && !loading && (
                  <Link
                    href="/match"
                    className="btn-purple px-6 py-3 rounded-lg font-semibold inline-block"
                  >
                    🔍 Find Matches
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Embedded Chat Component
interface EmbeddedChatProps {
  currentUserAddress: string;
  otherUserAddress: string;
}

function EmbeddedChat({
  currentUserAddress,
  otherUserAddress,
}: EmbeddedChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages when contact changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const fetchedMessages = await getMessages(
          currentUserAddress,
          otherUserAddress
        );
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [currentUserAddress, otherUserAddress]);

  // Subscribe to real-time messages
  useEffect(() => {
    const subscription = subscribeToMessages(
      currentUserAddress,
      otherUserAddress,
      (newMessage: Message) => {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserAddress, otherUserAddress]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(
        currentUserAddress,
        otherUserAddress,
        newMessage.trim()
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-gray-300">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-gray-300">No messages yet</p>
              <p className="text-gray-400 text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isCurrentUser =
                message.sender_address.toLowerCase() ===
                currentUserAddress.toLowerCase();
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-sm"
                        : "bg-gray-700 text-white rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    {message.created_at && (
                      <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-purple-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-full border border-gray-600 focus:border-purple-500 focus:outline-none placeholder-gray-400"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>📤</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
