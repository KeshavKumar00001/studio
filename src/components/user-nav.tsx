'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { User, LogOut, Settings, UserCog, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function UserNav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {isAuthenticated ? (
              <>
                <AvatarImage
                  src="https://picsum.photos/seed/user-avatar/100/100"
                  alt={user?.name || 'User'}
                />
                <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
              </>
            ) : (
                <div className='flex h-full w-full items-center justify-center rounded-full bg-muted'>
                    <User className="h-5 w-5" />
                </div>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {isAuthenticated && user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCog className='mr-2' />
                Profile
                </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className='mr-2' />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className='mr-2' />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
                <Link href="/login">
                    <LogIn className='mr-2' />
                    Log In
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/register">
                    <UserPlus className='mr-2' />
                    Register
                </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
