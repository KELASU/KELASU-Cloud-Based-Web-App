import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import from step 2

// GET: Fetch all levels from the database
export async function GET() {
  try {
    const levels = await prisma.escapeLevel.findMany({
      orderBy: { createdAt: 'desc' }, // Newest first
    });
    return NextResponse.json(levels);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}

// POST: Save a new level to the database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, author, bgImage, puzzles } = body;

    if (!name || !puzzles) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLevel = await prisma.escapeLevel.create({
      data: {
        name,
        author: author || 'Anonymous',
        bgImage,
        puzzles, // Prisma handles JSON serialization automatically
      },
    });

    return NextResponse.json(newLevel);
  } catch (error) {
    console.error("Database Save Error:", error);
    return NextResponse.json({ error: "Failed to save level" }, { status: 500 });
  }
}
