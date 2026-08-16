export interface NavItem {
  label: string;
  href: string;
  iconName: "BookOpen" | "CookingPot" | "BowlFood" | "Calendar" | "ChartLineUp" | "User";
}

export interface NavigationShellProps {
  children: React.ReactNode;
}
