import React from "react";
import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#000A1B]">
      <Sidebar
        userProfile={{
          fullName: session.profile.fullName,
          email: session.profile.email,
          role: session.activeRole,
        }}
      />
      <div className="lg:pl-64 min-h-screen flex flex-col pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
