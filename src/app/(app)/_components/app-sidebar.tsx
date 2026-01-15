"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { MenuIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type AppSidebarProps = {
  user: {
    name?: string | null;
    email: string;
  };
};

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Usuários" },
  { href: "/tasks", label: "Tasks" },
] as const;

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  return (
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <div className="text-sm font-medium">{user.name ?? "Conta"}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>

        <Separator />

        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-3">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function AppMobileSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await authClient.signOut();
    setOpen(false);
    router.replace("/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menu"
        >
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <div className="text-sm font-medium">{user.name ?? "Conta"}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>

          <Separator />

          <nav className="flex flex-col gap-1 p-3">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-3">
            <Button variant="outline" className="w-full" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
