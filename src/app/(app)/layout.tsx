import { redirect } from "next/navigation";

import { getSession } from "@/server/better-auth/server";

import { AppMobileSidebar, AppSidebar } from "./_components/app-sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-[260px_1fr]">
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
        }}
      />

      <div className="min-w-0">
        <header className="flex items-center gap-3 border-b bg-background p-4 md:hidden">
          <AppMobileSidebar
            user={{
              name: session.user.name,
              email: session.user.email,
            }}
          />

          <div className="min-w-0">
            <div className="text-sm font-medium">SaaS Tasks</div>
            <div className="truncate text-xs text-muted-foreground">
              {session.user.email}
            </div>
          </div>
        </header>

        <main className="min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}
