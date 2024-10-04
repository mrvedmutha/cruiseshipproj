import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
// import User from "@/model/User"; // Use your User model or any other collection

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch some data from your collection (example with User model)
    // const users = await User.find({});

    // Return the result
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
    });
  }
}
