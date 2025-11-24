/**
 * Login Page - Admin Authentication
 */

"use client";

import React, { useState } from "react";
import { useAuth } from "../../../src/contexts/auth.context";
import { Input } from "../../../src/components/ui/input";
import { Button } from "../../../src/components/ui/button";
import { Card } from "../../../src/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useValidation } from "../../../src/hooks/use-validation";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errors, validateField, validateForm } = useValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!validateForm({ email, password }, {
      email: ['required'],
      password: ['required']
    })) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setAuthError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {authError && (
          <div className="p-4 bg-danger/10 border border-danger rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField('email', e.target.value, ['required']);
              }}
              disabled={isSubmitting}
              autoComplete="email"
              error={errors.email}
              name="email"
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField('password', e.target.value, ['required']);
              }}
              disabled={isSubmitting}
              autoComplete="current-password"
              error={errors.password}
              name="password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            color="var(--color-fourth)"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>Visa Plus Admin Dashboard</p>
        </div>
      </Card>
    </div>
  );
}
