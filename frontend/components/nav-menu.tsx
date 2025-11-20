'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboardIcon, 
  CreditCardIcon, 
  FileDownIcon,
  LogOutIcon 
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Subscription',
    href: '/subscription',
    icon: CreditCardIcon,
  },
];

export function NavMenu() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-accent' : 'transparent'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="justify-start px-3 py-2 text-sm font-medium"
        onClick={handleLogout}
      >
        <LogOutIcon className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </Button>
    </nav>
  );
}