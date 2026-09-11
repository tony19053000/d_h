import { User } from '@/types';

export const SEEDED_USERS: Record<string, User> = {
  user_alice: {
    id: 'user_alice',
    name: 'Alice Chen',
    email: 'alice.chen@example.com',
    avatar: 'https://picsum.photos/id/64/150/150',
  },
  user_bob: {
    id: 'user_bob',
    name: 'Bob Kumar',
    email: 'bob.kumar@example.com',
    avatar: 'https://picsum.photos/id/91/150/150',
  },
};

export const SESSION_COOKIE_NAME = 'session_user_id';
