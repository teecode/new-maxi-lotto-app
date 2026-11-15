import { useMemo } from "react";
import { ProfileSettingsOne } from "@/constants";
import { ProfileMenuGrid } from "./profile-menu-grid";

interface ProfileNavigationProps {
  freeTicketCount?: number;
}

const ProfileNavigation = ({ freeTicketCount = 0 }: ProfileNavigationProps) => {
  const items = useMemo(
    () =>
      ProfileSettingsOne.map((item) =>
        item.route === "/bonuses" && freeTicketCount > 0
          ? { ...item, badge: `${freeTicketCount} Free` }
          : item,
      ),
    [freeTicketCount],
  );

  return <ProfileMenuGrid items={items} />;
};

export default ProfileNavigation;
