import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// User interface for the database
export interface User {
  id?: string;
  Blk_Id: string;
  profile_name: string;
  profile_id: string;
  wallet_address: string;
  created_at?: string;
}

// Function to check if user exists by wallet address (stored in Blk_Id)
export async function checkUserExists(
  walletAddress: string
): Promise<User | null> {
  try {
    // Try the original case first
    let { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("Blk_Id", walletAddress)
      .single();

    // If not found, try lowercase
    if (error && error.code === "PGRST116") {
      const result = await supabase
        .from("User")
        .select("*")
        .eq("Blk_Id", walletAddress.toLowerCase())
        .single();
      data = result.data;
      error = result.error;
    }

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("Error checking user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
}

// Function to create new user
export async function createUser(
  userData: Omit<User, "id" | "created_at">
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("User")
      .insert([
        {
          Blk_Id: userData.wallet_address.toLowerCase(),
          profile_id: userData.profile_id,
          profile_name: userData.profile_name,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Function to update user profile
export async function updateUserProfile(
  walletAddress: string,
  updates: Partial<User>
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("User")
      .update(updates)
      .eq("Blk_Id", walletAddress.toLowerCase())
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

// Debug function to test the connection and table structure
export async function debugSupabase() {
  try {
    console.log("Testing Supabase connection...");

    // Test 1: Try to get all users (without filtering)
    const { data: allUsers, error: allError } = await supabase
      .from("User")
      .select("*")
      .limit(1);

    console.log("All users test:", { data: allUsers, error: allError });

    // Test 2: Test the column names
    const { data: columnTest, error: columnError } = await supabase
      .from("User")
      .select("Blk_Id, profile_name, profile_id")
      .limit(1);

    console.log("Column test:", { data: columnTest, error: columnError });

    return { allUsers, columnTest };
  } catch (error) {
    console.error("Debug error:", error);
    return null;
  }
}

// Message interface for the database
export interface Message {
  id?: string;
  chat_id: string;
  sender_address: string;
  receiver_address: string;
  message: string;
  created_at?: string;
}

// Function to generate chat ID from two addresses
export function generateChatId(address1: string, address2: string): string {
  // Sort addresses to ensure consistent chat ID regardless of order
  const sortedAddresses = [
    address1.toLowerCase(),
    address2.toLowerCase(),
  ].sort();
  return `${sortedAddresses[0]}_${sortedAddresses[1]}`;
}

// Function to send a message
export async function sendMessage(
  senderAddress: string,
  receiverAddress: string,
  messageText: string
): Promise<Message | null> {
  try {
    const chatId = generateChatId(senderAddress, receiverAddress);

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          sender_address: senderAddress.toLowerCase(),
          receiver_address: receiverAddress.toLowerCase(),
          message: messageText,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

// Function to get messages for a chat
export async function getMessages(
  address1: string,
  address2: string
): Promise<Message[]> {
  try {
    const chatId = generateChatId(address1, address2);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Function to subscribe to real-time messages (fallback to polling)
export function subscribeToMessages(
  address1: string,
  address2: string,
  callback: (message: Message) => void
) {
  const chatId = generateChatId(address1, address2);
  let lastMessageTime = new Date().toISOString();

  // Try real-time subscription first
  const subscription = supabase
    .channel(`messages:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  // Fallback: Poll for new messages every 2 seconds
  const pollInterval = setInterval(async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .gt("created_at", lastMessageTime)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        data.forEach((message) => {
          callback(message);
        });
        // Update last message time
        lastMessageTime = data[data.length - 1].created_at!;
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, 2000);

  // Return cleanup function
  return {
    unsubscribe: () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    },
  };
}
