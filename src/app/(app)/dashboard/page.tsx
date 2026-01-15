import { getSession } from "@/server/better-auth/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo(a) de volta, {session?.user?.name ?? session?.user?.email}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuário autenticado</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            {session?.user?.email}
          </div>
          {session?.user?.name ? (
            <div>
              <span className="text-muted-foreground">Nome:</span>{" "}
              {session.user.name}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
