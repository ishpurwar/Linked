import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://byqxwlhjnoqjjicqwwlu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cXh3bGhqbm9xamppY3F3d2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTY4MDksImV4cCI6MjA2OTg3MjgwOX0.U8jCCNDPkq_jlqBydONDkYDIjT8uqd46CS3o4GxnRZU";

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
    console.log("Checking user existence for:", walletAddress);
    
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

    console.log("User check result:", data);
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
