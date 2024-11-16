import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentuser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentuser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}
