import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, ExternalLink, Star, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string;
  current_tier: number;
  total_invites: number;
  user_id: string;
}

const TierContent = () => {
  const { tier } = useParams<{ tier: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleBuyClick = () => {
    window.open('https://t.me/babykk001', '_blank');
  };

  const tierData = {
    1: { 
      title: "Tier 1 Content", 
      videos: "4,500+ Videos (7-14 Years)", 
      price: "$50 or 50 invites",
      description: "Access to our basic tier with carefully curated content for ages 7-14."
    },
    2: { 
      title: "Tier 2 Content", 
      videos: "20,000+ Videos (5-17 Years)", 
      price: "$90 or 100 invites",
      description: "Expanded library with content suitable for ages 5-17."
    },
    3: { 
      title: "Tier 3 Content", 
      videos: "100,000+ Videos (5-14 Years)", 
      price: "$120 or 250 invites",
      description: "Large collection focusing on the 5-14 age range."
    },
    4: { 
      title: "Tier 4 Content", 
      videos: "190,000+ Videos (3-17 Years)", 
      price: "$250 or 350 invites",
      description: "Massive library covering ages 3-17 with premium content."
    },
    5: { 
      title: "Tier 5 Content", 
      videos: "300,000+ Videos (1-17 Years)", 
      price: "$350 or 500 invites",
      description: "Nearly complete access with content for ages 1-17."
    },
    6: { 
      title: "Tier 6 Content", 
      videos: "780,000+ Videos (0-17 Years)", 
      price: "$450 or 600 invites",
      description: "Ultimate access - our complete library spanning ages 0-17."
    },
  };

  const currentTierData = tierData[tier as '1' | '2' | '3' | '4' | '5' | '6'];
  const tierNumber = parseInt(tier || "1");
  const hasAccess = profile ? profile.current_tier >= tierNumber : false;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentTierData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tier not found</h2>
          <p className="text-muted-foreground">The requested tier does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {currentTierData.title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {currentTierData.description}
          </p>
        </div>
        <Badge 
          variant={hasAccess ? "default" : "outline"} 
          className={`text-lg px-4 py-2 ${
            hasAccess 
              ? "bg-gradient-primary text-primary-foreground" 
              : "border-warning/50 text-warning"
          }`}
        >
          {hasAccess ? (
            <>
              <Trophy className="h-4 w-4 mr-2" />
              Unlocked
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          )}
        </Badge>
      </div>

      {/* Tier Info Card */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="h-6 w-6 text-primary" />
            Tier {tierNumber} Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Content Details</h3>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <span className="font-medium">{currentTierData.videos}</span>
              </div>
              <p className="text-muted-foreground">
                {currentTierData.description}
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Access Options</h3>
              <div className="space-y-2">
                <p className="text-lg font-medium text-primary">
                  {currentTierData.price}
                </p>
                <Button 
                  onClick={handleBuyClick}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buy Access
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Access */}
      {hasAccess ? (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-success" />
              Content Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Video className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Access Granted!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You have unlocked Tier {tierNumber}! The content library will be implemented here. 
                Contact support through Telegram for immediate access to content.
              </p>
              <Button 
                onClick={handleBuyClick}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-warning" />
              Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Tier {tierNumber} Locked</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You need to reach Tier {tierNumber} to access this content. 
                {profile && (
                  <>
                    <br />
                    Current tier: {profile.current_tier} | Total invites: {profile.total_invites}
                  </>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleBuyClick}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buy Access
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Path */}
      {!hasAccess && (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>How to Unlock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Option 1: Invite Friends</h4>
                <p className="text-sm text-muted-foreground">
                  Invite friends to join BabyKK and earn invite credits. Each successful registration counts towards your tier progression.
                </p>
                <div className="text-sm">
                  <span className="font-medium">Required: </span>
                  <span className="text-primary">{currentTierData.price.split(' or ')[1]}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Option 2: Direct Purchase</h4>
                <p className="text-sm text-muted-foreground">
                  Get instant access by purchasing the tier directly through our Telegram channel.
                </p>
                <div className="text-sm">
                  <span className="font-medium">Price: </span>
                  <span className="text-primary">{currentTierData.price.split(' or ')[0]}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TierContent;