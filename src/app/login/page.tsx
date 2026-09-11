import { getCurrentUser } from '@/lib/session';
import { LoginClient } from './LoginClient';

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <LoginClient currentUserId={currentUser?.id} />
    </main>
  );
}
