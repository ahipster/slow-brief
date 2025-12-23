import { NextResponse } from 'next/server';
import { getCurrentUser, getUserRole } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  const role = await getUserRole(user.uid);
  return NextResponse.json({ role });
}
