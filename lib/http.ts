import { z } from 'zod';

/**
 * Schema for randomuser.me API response validation
 */
export const RandomUserSchema = z.object({
  results: z.array(z.object({
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
  })).length(1),
});

export type RandomUserResponse = z.infer<typeof RandomUserSchema>;

/**
 * Fetches and validates user data from randomuser.me API
 */
export async function getRandomUser(): Promise<RandomUserResponse> {
  const response = await fetch('https://randomuser.me/api/?results=1&nat=us', {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('خطا در دریافت اطلاعات کاربر');
  }

  const json = await response.json();
  return RandomUserSchema.parse(json);
}
