import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Constants from "../../utils/constants";
import { getCSRFToken, login } from "../../utils/authService";

export function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState("ssp");
  const [password, setPass] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(Constants.API_BASE_URL)
    try {
      await getCSRFToken()
      
      const response = await login(JSON.stringify({username,password}));
      const data = response.data
      console.log(response)
      console.log(data)
      if (response.status!=200) {
        throw new Error(data.message || "Login failed");
      }
      // Handle successful login (e.g., save token, redirect)
      alert("Login successful!");
      if (data.username == "security")
        navigate("/securityDashboard")
      if(data.username == "facultyadvisor")
        navigate("/facultyDashboard")
      if(data.username == "studentwelfare")
        navigate("/welfareDashboard")
      if(data.username == "studentcouncil")
        navigate("/councilDashboard")
      if(data.username == "securityhead")
        navigate("/securityDashboard")
      if(data.username == "clubmember")
        navigate("/clubDashboard")
      if(data.username == "admin")
        navigate("/users")
      if(data.username == "ssp")
        navigate("/users")
      // Example: localStorage.setItem("token", data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
