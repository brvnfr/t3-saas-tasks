"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { type SignUpInput, signUpSchema } from "@/modules/auth/auth.schemas";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpInput) => {
    const res = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      form.setError("email", { message: "Não foi possível criar sua conta" });
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="mínimo 8 caracteres"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Criando..." : "Criar conta"}
            </Button>
          </form>
        </Form>

        <div className="text-sm text-muted-foreground">
          Já tem conta?{" "}
          <a className="underline" href="/login">
            Entrar
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
