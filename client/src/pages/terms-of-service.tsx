import { Seo } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, AlertTriangle, Scale, Ban, RefreshCw } from "lucide-react";

export default function TermsOfService() {
  return (
    <>
      <Seo
        title="Terms of Service"
        description="Read the Terms of Service for YT2MP3 YouTube to MP3 Converter. Understand the rules and guidelines for using our free audio conversion service."
        keywords="terms of service, terms and conditions, youtube to mp3 terms, usage policy, legal terms"
      />
      
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
                  <p className="text-muted-foreground mb-4">
                    By accessing and using YT2MP3 YouTube to MP3 Converter ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                  </p>
                  <p className="text-muted-foreground">
                    These terms apply to all users of the Service, including visitors, registered users, and any other individuals who access or use the Service.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Scale className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Service Description</h2>
                  <p className="text-muted-foreground mb-4">
                    YT2MP3 provides a free online tool that allows users to convert YouTube videos to MP3 audio format. Our service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Extracts audio from publicly available YouTube videos</li>
                    <li>Converts audio to MP3 format with various quality options (128kbps, 192kbps, 320kbps)</li>
                    <li>Provides temporary download links for converted files</li>
                    <li>Supports videos up to 2 hours in length</li>
                    <li>Does not require user registration or account creation</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Acceptable Use</h2>
                  <p className="text-muted-foreground mb-4">
                    You agree to use our service only for lawful purposes. Acceptable uses include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Converting videos you have created or own the rights to</li>
                    <li>Converting videos that are licensed under Creative Commons</li>
                    <li>Converting videos for personal, non-commercial use where permitted by law</li>
                    <li>Converting videos where you have explicit permission from the copyright holder</li>
                    <li>Educational and research purposes where fair use applies</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8 border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-4">
                <Ban className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Prohibited Uses</h2>
                  <p className="text-muted-foreground mb-4">
                    You must NOT use our service to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Download or convert copyrighted content without authorization</li>
                    <li>Distribute converted files commercially without proper licensing</li>
                    <li>Use automated scripts, bots, or scrapers to access the service</li>
                    <li>Attempt to bypass any service limitations or security measures</li>
                    <li>Engage in any activity that violates YouTube's Terms of Service</li>
                    <li>Use the service for any illegal purposes</li>
                    <li>Overload or disrupt the service infrastructure</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Copyright and Intellectual Property</h2>
                  <p className="text-muted-foreground mb-4">
                    Users are solely responsible for ensuring they have the right to convert and download content. By using our service, you acknowledge:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Most YouTube videos are protected by copyright</li>
                    <li>Downloading copyrighted content without permission may be illegal in your jurisdiction</li>
                    <li>We are not responsible for how you use the converted files</li>
                    <li>Copyright holders may take legal action against unauthorized use</li>
                    <li>We comply with DMCA and will respond to valid takedown requests</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <RefreshCw className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
                  <p className="text-muted-foreground mb-4">
                    We strive to provide reliable service, but:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The service is provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee uninterrupted or error-free service</li>
                    <li>Downloaded files are available for a limited time (30 minutes)</li>
                    <li>We reserve the right to modify or discontinue the service at any time</li>
                    <li>Service performance may vary based on server load and video availability</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We shall not be liable for any indirect, incidental, or consequential damages</li>
                <li>We are not responsible for any loss of data or files</li>
                <li>Users assume all risks associated with using the service</li>
                <li>Our total liability shall not exceed the amount paid by you (if any)</li>
              </ul>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless YT2MP3, its operators, employees, and affiliates from any claims, damages, losses, or expenses arising from your use of the service, violation of these terms, or infringement of any third-party rights.
              </p>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of the service after changes constitutes acceptance of the modified terms. We encourage you to review these terms periodically.
              </p>
            </Card>

            <Card className="p-6 md:p-8 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact us through our Contact page. We are happy to clarify any aspects of these terms.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
