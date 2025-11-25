'use client';

import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/auth.context';
import { IconButton } from '../ui/icon-button';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarLink,
  SidebarDivider,
} from './sidebar';

interface SidebarLinkItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
}

interface SidebarGroupItem {
  label: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  links: SidebarLinkItem[];
}

interface AppSidebarProps {
  groups: SidebarGroupItem[];
  header?: {
    title: string;
    subtitle: string;
    logo: ReactNode;
  };
  footer?: {
    userName: string;
    userEmail: string;
    userAvatar?: string;
  };
}

export function AppSidebar({ groups, header, footer }: AppSidebarProps) {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sidebar>
      {header && (
        <SidebarHeader>
          {header.logo}
        </SidebarHeader >
      )
      }

      <SidebarContent>
        {groups.map((group, groupIndex) => {
          const groupKey = `${group.label}-${groupIndex}`;
          const showDivider = groupIndex === groups.length - 2;

          return (
            <Fragment key={`group-${groupKey}`}>
              <SidebarGroup
                label={group.label}
                icon={group.icon}
                defaultOpen={group.defaultOpen ?? true}
              >
                {group.links.map((link, linkIndex) => (
                  <SidebarLink
                    key={`link-${groupKey}-${link.href}-${linkIndex}`}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    badge={link.badge}
                  />
                ))}
              </SidebarGroup>
              {showDivider && <SidebarDivider />}
            </Fragment>
          );
        })}
      </SidebarContent>

      {
        footer && user && (
          <SidebarFooter>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fourth flex items-center justify-center text-secondary font-bold">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-third truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <IconButton
                onClick={handleLogout}
                variant="logout"
                title="Logout"
              />
            </div>
          </SidebarFooter>
        )
      }
    </Sidebar >
  );
}
