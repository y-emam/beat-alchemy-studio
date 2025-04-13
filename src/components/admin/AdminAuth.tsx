
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Lock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call the RPC function to verify credentials
      const { data, error } = await supabase.rpc('verify_admin_credentials', {
        p_username: username,
        p_password: password
      });

      if (error) throw error;

      // Check the result
      if (data === true) {
        // Store admin session in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminUsername', username);
        
        // Call the success handler
        onAuthSuccess();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto px-4"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Lock size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Admin Authentication</h1>
        <p className="text-muted-foreground text-center mt-2">
          Please enter your credentials to access the dashboard
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-6 flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              placeholder="Enter username"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Log In"}
        </Button>
      </form>
    </motion.div>
  );
};
