import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <p className="text-sm text-muted-foreground">
         Pagina de usuarios (não implementado).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Listagem de usuários (não implementado).
        </CardContent>
      </Card>
    </div>
  );
}
