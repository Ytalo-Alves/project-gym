"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/Home");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push("/Home");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12 animate-fade-in-up">
          <div className="relative">
            <img
              src="/logo.png"
              alt="Olimpo Fitness"
              className="h-16 w-auto opacity-90"
            />
          </div>
        </div>

        {/* Login Card */}
        <div
          className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 shadow-2xl animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-zinc-500 text-sm">
              Entre para gerenciar sua academia
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-zinc-400 text-sm font-medium"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-zinc-400 text-sm font-medium"
              >
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 border-2 border-zinc-700 rounded peer-checked:bg-red-500 peer-checked:border-red-500 transition-all" />
                  <svg
                    className="absolute top-0 left-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Lembrar-me
                </span>
              </label>
              <a
                href="#"
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white h-11 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900/40 px-3 text-zinc-600 uppercase tracking-wider">
                ou
              </span>
            </div>
          </div>

          {/* Register Link */}
          <button
            type="button"
            onClick={() => router.push("/Register")}
            className="w-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-300 h-11 rounded-lg font-medium transition-all duration-200"
            disabled={isLoading}
          >
            Criar uma conta
          </button>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs text-zinc-600 mt-8 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          © 2024 Olimpo Fitness. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
