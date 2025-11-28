import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";
import { Seo } from "@/components/seo";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found (404)"
        description="The page you're looking for doesn't exist. Return to YT2MP3 YouTube to MP3 Converter to convert videos to audio."
      />
      
      <div className="min-h-[60vh] w-full flex items-center justify-center py-16">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <p className="mt-2 text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
            </div>

            <Link href="/">
              <Button className="gap-2">
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
