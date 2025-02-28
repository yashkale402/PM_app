// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/dbConnect";

import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, name } = await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      email,
      password: hashed,
      name,
    });

    await newUser.save();

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
