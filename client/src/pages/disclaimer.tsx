import { Seo } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Scale, Shield, FileWarning, Info } from "lucide-react";

export default function Disclaimer() {
  return (
    <>
      <Seo
        title="Disclaimer"
        description="Important disclaimer for YT2MP3 YouTube to MP3 Converter. Understand the legal responsibilities and limitations of using our audio conversion service."
        keywords="disclaimer, legal notice, youtube to mp3 disclaimer, copyright notice, terms of use"
      />
      
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read this disclaimer carefully before using YT2MP3.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 md:p-8 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Important Notice</h2>
                  <p className="text-muted-foreground">
                    YT2MP3 is a tool that allows users to convert YouTube videos to MP3 format. This service is provided for personal and educational use only. Users are solely responsible for ensuring they have the necessary rights and permissions to convert and download content.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Scale className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Copyright Responsibility</h2>
                  <p className="text-muted-foreground mb-4">
                    Most content on YouTube is protected by copyright law. By using YT2MP3, you acknowledge and agree that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>You will only convert content that you have the legal right to download</li>
                    <li>You are responsible for complying with all applicable copyright laws in your jurisdiction</li>
                    <li>Unauthorized downloading of copyrighted material may be illegal</li>
                    <li>We do not encourage or condone copyright infringement</li>
                    <li>You may only use converted content for personal, non-commercial purposes unless you have proper authorization</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
                  <p className="text-muted-foreground mb-4">
                    YT2MP3 and its operators:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Do not host any copyrighted audio or video content on our servers</li>
                    <li>Are not responsible for how users utilize the converted files</li>
                    <li>Do not verify the copyright status of content submitted for conversion</li>
                    <li>Cannot be held liable for any damages resulting from the use of this service</li>
                    <li>Reserve the right to refuse service or remove access at any time</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <FileWarning className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">YouTube Terms of Service</h2>
                  <p className="text-muted-foreground mb-4">
                    Users should be aware that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>YouTube's Terms of Service may restrict downloading of certain content</li>
                    <li>Our service operates independently of YouTube</li>
                    <li>We are not affiliated with, endorsed by, or partnered with YouTube or Google</li>
                    <li>Changes to YouTube's API or policies may affect our service functionality</li>
                    <li>Users should review YouTube's Terms of Service for their own compliance</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Service Disclaimer</h2>
                  <p className="text-muted-foreground mb-4">
                    Regarding our service operations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The service is provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee continuous, uninterrupted, or secure access</li>
                    <li>Conversion quality may vary based on source video quality</li>
                    <li>We may modify, suspend, or discontinue the service without notice</li>
                    <li>Technical issues may occasionally affect conversion availability</li>
                    <li>Converted files are temporary and automatically deleted after 30 minutes</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Fair Use Guidance</h2>
              <p className="text-muted-foreground mb-4">
                Some jurisdictions recognize "fair use" or "fair dealing" exceptions to copyright law. Generally, these may apply when content is used for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Personal, non-commercial purposes</li>
                <li>Educational or research purposes</li>
                <li>Commentary, criticism, or review</li>
                <li>News reporting</li>
                <li>Parody or transformative works</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                However, fair use is complex and varies by jurisdiction. When in doubt, seek legal advice or obtain permission from the copyright holder.
              </p>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">DMCA Compliance</h2>
              <p className="text-muted-foreground mb-4">
                We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA):
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We respond promptly to valid DMCA takedown notices</li>
                <li>We may disable access for repeat infringers</li>
                <li>Copyright holders can contact us through our Contact page</li>
                <li>We cooperate with law enforcement when required</li>
              </ul>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">External Links</h2>
              <p className="text-muted-foreground">
                Our website may contain links to external websites. We are not responsible for the content, privacy policies, or practices of any third-party sites. Visiting external links is at your own risk.
              </p>
            </Card>

            <Card className="p-6 md:p-8 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-semibold mb-3">Acceptance</h2>
              <p className="text-muted-foreground">
                By using YT2MP3, you acknowledge that you have read, understood, and agree to this disclaimer. If you do not agree with any part of this disclaimer, please do not use our service.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
