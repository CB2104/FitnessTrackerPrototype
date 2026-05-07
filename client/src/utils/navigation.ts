import {
  ActivityIcon,
  HomeIcon,
  UserIcon,
  UtensilsIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", icon: HomeIcon },
  { path: "/food", label: "Food", icon: UtensilsIcon },
  { path: "/activity", label: "Activity", icon: ActivityIcon },
  { path: "/profile", label: "Profile", icon: UserIcon },
];
