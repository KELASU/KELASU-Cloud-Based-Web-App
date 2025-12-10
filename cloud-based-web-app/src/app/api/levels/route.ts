import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const levels = await prisma.escapeLevel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(levels);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, author, bgImage, winImage, puzzles } = body;

    if (!name || !puzzles) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newLevel = await prisma.escapeLevel.create({
      data: {
        name,
        author: author || 'Anonymous',
        bgImage,
        winImage,
        puzzles: puzzles,
      },
    });

    return NextResponse.json(newLevel);
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Failed to save level" }, { status: 500 });
  }
}