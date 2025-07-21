import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Play } from "lucide-react";

const FreePreview = () => {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Free Preview
          </h1>
          <p className="text-muted-foreground mt-2">
            Sample content available to all users
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 border-success/50 text-success">
          <Eye className="h-4 w-4 mr-2" />
          Free Access
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="bg-card/50 backdrop-blur border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Preview {index}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted/30 rounded-lg border border-border/30 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Video Preview {index}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Content will be added here
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Sample Content {index}</h4>
                <p className="text-xs text-muted-foreground">
                  This is a placeholder for free preview content. Actual videos will be implemented here in the future.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Duration: --:--</span>
                <span>Quality: HD</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Want More Content?</h3>
            <p className="text-muted-foreground">
              Unlock thousands of premium videos by inviting friends or purchasing access to higher tiers.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Tier 1: 4,500+ Videos
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Tier 6: 780,000+ Videos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreePreview;