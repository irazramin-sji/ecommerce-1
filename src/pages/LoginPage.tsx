import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { PageLayout } from "@/components/layout/PageLayout";
import { useNavigate, useLocation } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/account";

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const res = await signIn({ email: data.email, password: data.password });
    if (res?.error) {
      alert(res.error.message || "Login failed");
      return;
    }
    navigate(from);
  };

  if (user) {
    navigate("/account");
    return null;
  }

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className="max-w-md mx-auto mt-8">
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm">Email</label>
              <input {...register("email")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input type="password" {...register("password")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">Sign in</button>
            </div>
          </form>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
