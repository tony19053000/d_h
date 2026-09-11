import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types';
import { prisma } from './prisma';

export const SESSION_COOKIE_NAME = 'session_user_id';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!userId) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) return null;

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar || `https://picsum.photos/seed/${dbUser.id}/150/150`,
    };
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}
