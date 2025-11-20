'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { NavMenu } from '@/components/nav-menu';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboardIcon, 
  CreditCardIcon, 
  FileDownIcon,
  LogOutIcon,
  MenuIcon
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background p-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-8">
            <Link href="/dashboard" className="text-2xl font-bold">
              AppScreens
            </Link>
          </div>
          
          <div className="flex-1">
            <nav className="grid items-start gap-2">
              <Link href="/dashboard">
                <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </span>
              </Link>
              <Link href="/subscription">
                <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </span>
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto pt-6 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="border-b bg-background sticky top-0 z-30">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
        </header>
        
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}