import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, answer: 0 });
  const [mathAnswer, setMathAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const { toast } = useToast();

  const generateMathQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMathQuestion({ a, b, answer: a + b });
  };

  useEffect(() => {
    generateMathQuestion();
    
    // Get invite code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const invite = urlParams.get('invite');
    if (invite) {
      setInviteCode(invite);
    }
  }, []);

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP:', error);
      return null;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(mathAnswer) !== mathQuestion.answer) {
      toast({
        title: "Error",
        description: "Incorrect math answer. Please try again.",
        variant: "destructive",
      });
      generateMathQuestion();
      setMathAnswer("");
      return;
    }

    setLoading(true);

    try {
      const clientIP = await getClientIP();
      
      // Check for existing accounts from the same IP
      if (clientIP) {
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('ip_address', clientIP);
          
        if (existingProfiles && existingProfiles.length > 0) {
          toast({
            title: "Error",
            description: "An account already exists from this IP address",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: `${username}@babykk.local`,
        password,
        options: {
          data: {
            username,
            ip_address: clientIP,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          toast({
            title: "Error",
            description: "Username already exists. Please choose another.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      }

      // If user was invited, update the inviter's count
      if (inviteCode && authData.user) {
        try {
          await supabase.rpc('increment_invite_count', { 
            inviter_id: inviteCode 
          });
          
          // Update the new user's invited_by field
          await supabase
            .from('profiles')
            .update({ invited_by: inviteCode })
            .eq('user_id', authData.user.id);
        } catch (error) {
          console.error('Error updating invite count:', error);
        }
      }

      toast({
        title: "Success",
        description: "Account created successfully! You are now logged in.",
      });

      onAuthSuccess();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(mathAnswer) !== mathQuestion.answer) {
      toast({
        title: "Error",
        description: "Incorrect math answer. Please try again.",
        variant: "destructive",
      });
      generateMathQuestion();
      setMathAnswer("");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@babykk.local`,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Invalid username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        onAuthSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur border-border/50 shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            BabyKK
          </CardTitle>
          <p className="text-muted-foreground">Access Portal</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-input/50 border-border/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-input/50 border-border/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="math">
                Verification: What is {mathQuestion.a} + {mathQuestion.b}?
              </Label>
              <Input
                id="math"
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Enter the answer"
                className="bg-input/50 border-border/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium"
                disabled={loading}
              >
                {loading ? "Creating..." : "Sign Up"}
              </Button>
              <Button
                type="button"
                onClick={handleSignIn}
                variant="outline"
                className="border-border/50 hover:bg-accent/10"
                disabled={loading}
              >
                {loading ? "Signing..." : "Sign In"}
              </Button>
            </div>
          </form>

          {inviteCode && (
            <p className="text-sm text-center text-muted-foreground">
              Invited by: {inviteCode}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};