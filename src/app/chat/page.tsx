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

interface ProfileData {
  name: string;
  age: string;
  interests: string;
  uri: string[];
  owner: string;
}

interface Contact {
  address: string;
  profile: ProfileData | null;
  tokenId: number | null;
  type: "match" | "super_match";
  lastMessage?: {
    text: string;
    timestamp: Date;
    from: string;
  };
}

export default function ChatPage() {
  const { signer, account, isConnected, connectWallet } = useWeb3();
  const [userExists, setUserExists] = useState(false);
  const [contract, setContract] = useState<ReturnType<
    typeof createDatingAppContract
  > | null>(null);
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
                lastMessage: {
                  text: "Hey! How are you doing?",
                  timestamp: new Date(
                    Date.now() -
                      Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
                  ), // Random time within last 7 days
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
                lastMessage: {
                  text: "Super match! ✨",
                  timestamp: new Date(
                    Date.now() -
                      Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)
                  ), // Random time within last 3 days
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Romantic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 glass-purple border-b border-purple-500/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
              💬 Chat Room
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        {/* Contacts Sidebar */}
        <div className="w-1/3 glass-purple border-r border-purple-500/30 flex flex-col backdrop-blur-xl">
          {/* Search Bar */}
          <div className="p-4 border-b border-purple-500/30">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass border border-purple-500/30 text-white placeholder-gray-400 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm"
              />
              <div className="absolute left-3 top-2.5 text-purple-300">🔍</div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="glass-purple p-4 rounded-xl animate-scale-in">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="text-gray-300">Loading contacts...</span>
                  </div>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="glass-purple p-6 rounded-xl mx-4 animate-scale-in">
                  <div className="text-4xl mb-4 animate-float">💔</div>
                  <p className="text-gray-300 mb-2">
                    {searchTerm
                      ? "No contacts found"
                      : "No matches to chat with yet"}
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/match"
                      className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors animate-glow"
                    >
                      Find your first match →
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredContacts.map((contact, index) => (
                  <div
                    key={`${contact.address}-${index}`}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 m-2 rounded-xl cursor-pointer transition-all duration-300 hover:glass hover:border-purple-400/50 card-hover ${
                      selectedContact?.address === contact.address
                        ? "glass border border-purple-500/50 shadow-lg shadow-purple-500/20"
                        : "hover:bg-purple-500/10"
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
                        {/* <div className="absolute -top-1 -right-1">
                          {contact.type === "super_match" ? (
                            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs">
                              ⭐
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-xs">
                              💕
                            </div>
                          )}
                        </div> */}
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold truncate">
                            {contact.profile?.name ||
                              `User ${contact.address.slice(-4)}`}
                          </h3>
                        </div>

                        {/* <p className="text-gray-400 text-sm truncate mb-1">
                          {contact.lastMessage?.text ||
                            "Start a conversation..."}
                        </p>

                        {contact.lastMessage && (
                          <p className="text-purple-400 text-xs font-medium">
                            {formatTimeAgo(contact.lastMessage.timestamp)}
                          </p>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass backdrop-blur-xl">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="glass-purple border-b border-purple-500/30 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
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
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 bg-black/20 backdrop-blur-sm flex flex-col">
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
            <div className="flex-1 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="text-center glass-purple p-8 rounded-2xl max-w-md mx-4 animate-scale-in">
                <div className="text-6xl mb-6 animate-float">💬</div>
                <h2 className="text-2xl font-bold gradient-text mb-4">
                  Select a contact to start chatting
                </h2>
                <p className="text-gray-300 mb-8">
                  Choose someone from your matches to begin a conversation
                </p>
                {contacts.length === 0 && !loading && (
                  <Link
                    href="/match"
                    className="btn-purple px-6 py-3 rounded-lg font-semibold inline-block animate-glow"
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
            <div className="glass-purple p-6 rounded-2xl animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="text-gray-300">Loading messages...</span>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center glass-purple p-8 rounded-2xl animate-scale-in">
              <div className="text-4xl mb-2 animate-float">💬</div>
              <p className="text-gray-300 mb-2">No messages yet</p>
              <p className="text-purple-300 text-sm">Start the conversation!</p>
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
                    className={`max-w-[70%] p-3 rounded-2xl backdrop-blur-sm ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white rounded-br-sm shadow-lg shadow-purple-500/20 border border-purple-400/30"
                        : "glass border border-purple-500/20 text-white rounded-bl-sm"
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
      <div className="border-t border-purple-500/30 p-4 glass backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 glass border border-purple-500/30 text-white px-4 py-3 rounded-full focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400 backdrop-blur-sm"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25 animate-glow"
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
