import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import toast, { Toaster } from "react-hot-toast";

type AuthMode = "login" | "signup";

const Login = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const navigate = useNavigate();
  const { login, signup, user } = useAppContext();

  const validateForm = (): string | null => {
    if (mode === "signup" && form.username.trim().length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup({
          username: form.username,
          email: form.email,
          password: form.email,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Toaster />
      <main className="login-page-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
            {mode === "login" ? "Sign in" : "Sign up"}
          </h2>
          <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
            {mode === "login"
              ? "Please enter email and password to sign in to your account."
              : "Please enter your details to create a new account."}
          </p>

          {/* Form fields and buttons would go here */}
          {mode !== "login" && (
            <div className="mt-4">
              <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative mt-2">
                <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
                <input
                  onChange={(e) => updateField("username", e.target.value)}
                  value={form.username}
                  type="text"
                  placeholder="enter a username"
                  className="login-input"
                  required
                />
              </div>
            </div>
          )}
          {/* email */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                onChange={(e) => updateField("email", e.target.value)}
                value={form.email}
                type="email"
                placeholder="enter your email"
                className="login-input"
                required
              />
            </div>
          </div>

          {/* password */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-2">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                onChange={(e) => updateField("password", e.target.value)}
                value={form.password}
                type={showPassword ? "text" : "password"}
                placeholder="enter your password"
                className="login-input pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button mt-6"
          >
            {isSubmitting
              ? "Signing in..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </button>

          {mode === "login" ? (
            <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="ml-1 cursor-pointer text-green-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="ml-1 cursor-pointer text-green-600 hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
