import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game'); 

    const where = game ? { game } : {};

    const scores = await prisma.score.findMany({
      where,
      orderBy: { value: 'desc' }, 
      take: 50, 
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { game, player, value, difficulty } = body;

    if (!game || !player || value === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newScore = await prisma.score.create({
      data: {
        game,
        player,
        value: Number(value),
        difficulty: difficulty || 'Normal',
      },
    });

    return NextResponse.json(newScore);
  } catch (error) {
    console.error("Leaderboard Save Error:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}