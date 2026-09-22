import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { PageLayout } from "@/components/layout/PageLayout";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const res = await signUp({ email: data.email, password: data.password, options: { data: { first_name: data.first_name, last_name: data.last_name } } });
    if (res?.error) {
      alert(res.error.message || "Registration failed");
      return;
    }
    navigate("/account");
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className="max-w-md mx-auto mt-8">
          <h1 className="text-xl font-bold mb-4">Create an account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm">First name</label>
              <input {...register("first_name")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">Last name</label>
              <input {...register("last_name")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input {...register("email")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input type="password" {...register("password")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm">Confirm password</label>
              <input type="password" {...register("passwordConfirm")} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
