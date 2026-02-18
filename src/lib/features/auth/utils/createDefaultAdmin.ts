import authService from "@/lib/services/firebase/authService";

/**
 * Creates the default admin account for testing
 * Run this once to set up the admin@glamlink.com account
 */
export async function createDefaultAdminAccount() {
  try {
    console.log("Creating default admin account...");
    
    const result = await authService.signUp(
      "admin@glamlink.com",
      "password123",
      "Admin User",
      "professional" // Will be treated as admin due to email
    );
    
    console.log("Default admin account created successfully!");
    console.log("Email: admin@glamlink.com");
    console.log("Password: password123");
    
    return result;
  } catch (error: any) {
    if (error.message?.includes("email-already-in-use")) {
      console.log("Admin account already exists");
    } else {
      console.error("Error creating admin account:", error);
    }
    throw error;
  }
}