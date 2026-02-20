import { NextResponse } from "next/server";
import { fetchAllHomeData, seedHomeData } from "@/lib/pages/home/server/homeUtil";
import { HomeApiResponse } from "@/lib/pages/home/config";
import { mockHomeData } from "@/lib/pages/home/mockData";

export async function GET() {
  try {
    // In development, optionally seed data
    if (process.env.NODE_ENV === "development") {
      await seedHomeData();
    }
    
    // Fetch all home page data
    const data = await fetchAllHomeData();
    
    const response: HomeApiResponse = {
      success: true,
      data,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    // Error in home API route
    
    // Return mock data as fallback
    const response: HomeApiResponse = {
      success: true,
      data: mockHomeData,
    };
    
    return NextResponse.json(response);
  }
}