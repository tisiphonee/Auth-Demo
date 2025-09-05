'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, CheckCircle, Mail, Phone, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { StorageManager } from '@/lib/storage';
import { User as UserType, getUserDisplayName } from '@/lib/user';

export function DashboardClient() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = StorageManager.getUser();
    
    if (!storedUser) {
      // No user found, redirect to login
      router.replace('/login');
      return;
    }

    setUser(storedUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    StorageManager.clearUser();
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const displayName = getUserDisplayName(user);

  return (
    <div className="min-h-screen page-enter">
      {/* Header */}
      <div className="glass-card border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                داشبورد
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 space-x-reverse bg-white/50 hover:bg-white/80 border-white/20 text-slate-700 hover:text-slate-900 transition-all duration-200 focus-visible rounded-xl text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                data-testid="logout-button"
                aria-label="خروج"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Welcome Card with Profile Picture */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            {/* Mobile Layout: Avatar above text */}
            <div className="flex flex-col items-center text-center space-y-6 sm:hidden">
              {/* Profile Picture */}
              <div className="relative">
                {user.picture ? (
                  <img
                    src={user.picture.large}
                    alt={`تصویر ${displayName}`}
                    className="w-20 h-20 rounded-full object-cover shadow-lg ring-2 ring-white"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg ${user.picture ? 'hidden' : ''}`}>
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-custom rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="space-y-4 w-full">
                <div>
                  <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    خوش آمدید، {displayName}!
                  </h2>
                </div>
                
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center justify-center gap-2.5 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 select-none" />
                    <span dir="ltr" className="text-slate-700 dark:text-slate-300 text-sm break-words select-text" data-testid="welcome-email-mobile">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 select-none" />
                    <span dir="ltr" className="text-slate-700 dark:text-slate-300 text-sm tracking-wide font-mono select-all" data-testid="welcome-phone-mobile">
                      {user.phoneNormalized}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout: Avatar beside text */}
            <div className="hidden sm:flex items-center space-x-6 space-x-reverse">
              {/* Profile Picture */}
              <div className="relative">
                {user.picture ? (
                  <img
                    src={user.picture.large}
                    alt={`تصویر ${displayName}`}
                    className="w-18 h-18 rounded-full object-cover shadow-lg ring-2 ring-white"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-18 h-18 rounded-full gradient-primary flex items-center justify-center shadow-lg ${user.picture ? 'hidden' : ''}`}>
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-custom rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-[32px] leading-[40px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    خوش آمدید، {displayName}!
                  </h2>
                </div>
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 select-none" />
                    <span dir="ltr" className="text-slate-700 dark:text-slate-300 text-sm break-words select-text" data-testid="welcome-email-desktop">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 select-none" />
                    <span dir="ltr" className="text-slate-700 dark:text-slate-300 text-sm tracking-wide font-mono select-all" data-testid="welcome-phone-desktop">
                      {user.phoneNormalized}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Personal Info Card */}
            <div className="glass-card rounded-3xl p-6 card-hover">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[20px] leading-[28px] font-semibold text-slate-900 dark:text-slate-100">اطلاعات شخصی</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">نام</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[120px]">{user.name.first}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">نام خانوادگی</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[120px]">{user.name.last}</span>
                </div>
                <div className="py-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">ایمیل</span>
                  </div>
                  <span dir="ltr" className="text-slate-700 dark:text-slate-300 text-sm break-words select-text block">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="glass-card rounded-3xl p-6 card-hover">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[20px] leading-[28px] font-semibold text-slate-900 dark:text-slate-100">اطلاعات تماس</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">شماره موبایل</span>
                  <span dir="ltr" className="text-slate-700 dark:text-slate-300 text-sm tracking-wide font-mono select-all">
                    {user.phoneNormalized}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="glass-card rounded-3xl p-6 card-hover md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[20px] leading-[28px] font-semibold text-slate-900 dark:text-slate-100">وضعیت حساب</h3>
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">حساب کاربری شما</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">فعال و آماده استفاده</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
