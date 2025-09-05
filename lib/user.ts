import { z } from 'zod';

// User schema for validation and typing
export const UserSchema = z.object({
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
  email: z.string().email(),
  picture: z.object({
    large: z.string().url(),
    medium: z.string().url(),
    thumbnail: z.string().url(),
  }),
  phoneNormalized: z.string().regex(/^\+989\d{9}$/),
});

export type User = z.infer<typeof UserSchema>;

// Storage key constant
export const USER_STORAGE_KEY = 'demo.user';

// Helper to get display name
export const getUserDisplayName = (user: User): string => {
  return `${user.name.first} ${user.name.last}`.trim();
};
