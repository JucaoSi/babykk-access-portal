import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Trophy, TrendingUp, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string;
  current_tier: number;
  total_invites: number;
  user_id: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInviteLink = () => {
    if (!profile) return '';
    return `https://www.babykk.xyz/?invite=${profile.user_id}`;
  };

  const copyInviteLink = () => {
    const link = getInviteLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
  };

  const getNextTierInfo = () => {
    if (!profile) return null;
    
    const tierRequirements = [50, 100, 250, 350, 500, 600];
    const currentTier = profile.current_tier;
    
    if (currentTier >= 6) {
      return { tier: 6, required: 600, isMaxTier: true };
    }
    
    return {
      tier: currentTier + 1,
      required: tierRequirements[currentTier],
      isMaxTier: false
    };
  };

  const getProgressPercentage = () => {
    if (!profile) return 0;
    
    const nextTier = getNextTierInfo();
    if (!nextTier || nextTier.isMaxTier) return 100;
    
    const previousRequired = nextTier.tier === 1 ? 0 : [0, 50, 100, 250, 350, 500][nextTier.tier - 2];
    const progressInTier = profile.total_invites - previousRequired;
    const tierRange = nextTier.required - previousRequired;
    
    return Math.min((progressInTier / tierRange) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const nextTierInfo = getNextTierInfo();

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {profile.username}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 border-primary/50 text-primary">
          Tier {profile.current_tier}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Invites */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{profile.total_invites}</div>
            <p className="text-xs text-muted-foreground">
              People you've invited
            </p>
          </CardContent>
        </Card>

        {/* Current Tier */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Tier {profile.current_tier}</div>
            <p className="text-xs text-muted-foreground">
              Your access level
            </p>
          </CardContent>
        </Card>

        {/* Next Tier */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Tier</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {nextTierInfo?.isMaxTier ? (
              <div>
                <div className="text-2xl font-bold text-success">Max Tier!</div>
                <p className="text-xs text-muted-foreground">
                  You've reached the highest tier
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-primary">
                  Tier {nextTierInfo?.tier}
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextTierInfo?.required - profile.total_invites} more invites needed
                </p>
                <div className="w-full bg-muted mt-2 rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invite Link */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Your Invite Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-muted/50 rounded-lg border border-border/30 font-mono text-sm">
              {getInviteLink()}
            </div>
            <Button onClick={copyInviteLink} size="sm" className="bg-gradient-primary">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this link to invite new users. Each successful registration will increase your invite count and potentially unlock new tiers.
          </p>
        </CardContent>
      </Card>

      {/* Tier Information */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle>Tier Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { tier: 1, invites: 50, price: "$50" },
              { tier: 2, invites: 100, price: "$90" },
              { tier: 3, invites: 250, price: "$120" },
              { tier: 4, invites: 350, price: "$250" },
              { tier: 5, invites: 500, price: "$350" },
              { tier: 6, invites: 600, price: "$450" },
            ].map((tier) => (
              <div
                key={tier.tier}
                className={`p-4 rounded-lg border ${
                  profile.current_tier >= tier.tier
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/30 border-border/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Tier {tier.tier}</span>
                  {profile.current_tier >= tier.tier && (
                    <Trophy className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {tier.price} or {tier.invites} invites
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;