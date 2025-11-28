import { Seo } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { Users, Zap, Shield, Heart, Target, Award } from "lucide-react";

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about YT2MP3 - the fast, free, and reliable YouTube to MP3 converter. Discover our mission to provide high-quality audio conversion without hassle."
        keywords="about yt2mp3, youtube to mp3 converter, about us, our mission, audio conversion service"
      />
      
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">About YT2MP3</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're passionate about making YouTube to MP3 conversion simple, fast, and accessible to everyone.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                YT2MP3 was created with a simple mission: to provide a hassle-free way to convert YouTube videos to high-quality MP3 audio files. We noticed that many existing conversion tools were cluttered with ads, required registration, or produced poor quality audio.
              </p>
              <p className="text-muted-foreground mb-4">
                We set out to build something better - a clean, fast, and reliable converter that respects users' time and privacy. No accounts, no unnecessary steps, just paste a link and get your MP3.
              </p>
              <p className="text-muted-foreground">
                Today, YT2MP3 serves thousands of users worldwide who need quick access to audio content from YouTube for personal use, education, and creative projects.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Our optimized servers ensure quick conversions, typically completing in under 30 seconds.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  No registration required. We don't store your data or converted files permanently.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from 128kbps, 192kbps, or 320kbps to get the audio quality you need.
                </p>
              </Card>
            </div>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                  <p className="text-muted-foreground mb-4">
                    We believe everyone should have easy access to tools that enhance their digital experience. Our mission is to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Provide a free, reliable YouTube to MP3 conversion service</li>
                    <li>Maintain a clean, ad-friendly interface without intrusive popups</li>
                    <li>Respect user privacy by not requiring registration or storing personal data</li>
                    <li>Continuously improve our conversion technology and user experience</li>
                    <li>Support content creators and respect intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">What Sets Us Apart</h2>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-foreground">No Registration:</span>
                      <span>Unlike many competitors, we never require you to create an account or provide personal information.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-foreground">Multiple Quality Options:</span>
                      <span>Choose the audio quality that suits your needs, from compressed 128kbps to high-quality 320kbps.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-foreground">Long Video Support:</span>
                      <span>Convert videos up to 2 hours long, perfect for podcasts, lectures, and music mixes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-foreground">Clean Interface:</span>
                      <span>Our simple, modern design focuses on what matters - getting your MP3 quickly and easily.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-foreground">Mobile Friendly:</span>
                      <span>Works perfectly on any device - desktop, tablet, or smartphone.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Technology</h2>
              <p className="text-muted-foreground mb-4">
                YT2MP3 is built using modern web technologies to ensure reliability and performance:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>React-based frontend for a smooth, responsive user experience</li>
                <li>Node.js backend for efficient server-side processing</li>
                <li>Advanced audio extraction algorithms for optimal quality</li>
                <li>Real-time progress tracking so you know exactly when your file will be ready</li>
                <li>Automatic file cleanup for security and storage efficiency</li>
              </ul>
            </Card>

            <Card className="p-6 md:p-8 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-semibold mb-3">Get in Touch</h2>
              <p className="text-muted-foreground">
                We love hearing from our users! Whether you have feedback, suggestions, or questions, feel free to reach out through our Contact page. Your input helps us improve YT2MP3 for everyone.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
