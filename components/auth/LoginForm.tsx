'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PhoneSchema, validateAndNormalizePhone } from '@/lib/phone';
import { StorageManager } from '@/lib/storage';
import { User } from '@/lib/user';
import { getRandomUser } from '@/lib/http';

const LoginFormSchema = z.object({
  phone: PhoneSchema,
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Normalize phone number
      const normalizedPhone = validateAndNormalizePhone(data.phone);

      // Fetch and validate user data from randomuser.me
      const userData = await getRandomUser();
      const randomUser = userData.results[0];

      // Create user object
      const user: User = {
        name: {
          first: randomUser.name.first,
          last: randomUser.name.last,
        },
        email: randomUser.email,
        picture: {
          large: randomUser.picture.large,
          medium: randomUser.picture.medium,
          thumbnail: randomUser.picture.thumbnail,
        },
        phoneNormalized: normalizedPhone,
      };

      // Store user in localStorage
      StorageManager.setUser(user);

      // Redirect to dashboard
      router.replace('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'خطای غیرمنتظره رخ داد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-[560px]">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        {/* Main Card */}
        <div className="glass-card rounded-3xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            {/* Hero chip with glow effect */}
            <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center shadow-lg relative">
              <div className="absolute inset-0 gradient-primary rounded-full blur-md opacity-30"></div>
              <div className="relative z-10">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-[32px] leading-[40px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                ورود
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-[18px]">
                برای ادامه، شماره موبایل خود را وارد کنید
              </p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 text-right block">
                      شماره موبایل
                    </FormLabel>
                    <FormControl>
                      <div dir="ltr" className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <Input
                          {...field}
                          type="tel"
                          inputMode="tel"
                          placeholder=""
                          disabled={isLoading}
                          aria-label="شماره موبایل"
                          className="text-left pl-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:shadow-inner transition-all duration-200 focus-ring tabular-nums tracking-wider disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:border-slate-300 dark:hover:border-slate-500 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </FormControl>
                    {/* Helper row - always reserved space */}
                    <div className="h-5">
                      <FormMessage className="text-danger-custom text-sm" />
                    </div>
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-4 text-sm text-danger-custom bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 space-x-reverse" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-danger-custom" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 gradient-primary hover:shadow-lg text-white font-medium rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:bg-slate-400 sheen focus-visible group"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال ورود...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                    <span>ورود</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-[18px]">
              با ورود، شما با قوانین و مقررات موافقت می‌کنید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
