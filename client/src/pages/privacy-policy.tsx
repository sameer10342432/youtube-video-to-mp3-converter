import { Seo } from "@/components/seo";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Read our privacy policy to understand how YT2MP3 YouTube to MP3 Converter collects, uses, and protects your personal information. Your privacy matters to us."
        keywords="privacy policy, data protection, youtube to mp3 privacy, user data, cookies policy"
      />
      
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Eye className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">
                    YT2MP3 is designed with your privacy in mind. We collect minimal information necessary to provide our YouTube to MP3 conversion service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>YouTube URLs you submit for conversion (temporarily stored during processing)</li>
                    <li>Technical information like browser type and device information for service optimization</li>
                    <li>Usage data to improve our conversion service performance</li>
                    <li>IP addresses for security and fraud prevention purposes</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Database className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>To process your YouTube to MP3 conversion requests</li>
                    <li>To provide and maintain our service functionality</li>
                    <li>To detect and prevent technical issues or abuse</li>
                    <li>To improve and optimize our conversion algorithms</li>
                    <li>To communicate with you regarding service updates</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Data Security</h2>
                  <p className="text-muted-foreground mb-4">
                    We implement appropriate security measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Converted files are automatically deleted after 30 minutes</li>
                    <li>We use secure HTTPS connections for all data transfers</li>
                    <li>No user registration or personal accounts are required</li>
                    <li>We do not store YouTube URLs permanently after conversion</li>
                    <li>Regular security audits and updates are performed</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Cookie className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Cookies and Tracking</h2>
                  <p className="text-muted-foreground mb-4">
                    Our website uses cookies to enhance your experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings like theme preference</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Advertising Cookies:</strong> Used by our advertising partners to show relevant ads</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    You can control cookie preferences through your browser settings.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
                  <p className="text-muted-foreground mb-4">
                    We may use third-party services that collect and process data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                    <li><strong>Google Analytics:</strong> For website traffic analysis</li>
                    <li><strong>YouTube:</strong> For accessing video metadata and content</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    These services have their own privacy policies governing data use.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    You have the following rights regarding your data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Right to access information we hold about you</li>
                    <li>Right to request deletion of your data</li>
                    <li>Right to opt-out of marketing communications</li>
                    <li>Right to lodge a complaint with a supervisory authority</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    To exercise these rights, please contact us through our Contact page.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </Card>

            <Card className="p-6 md:p-8 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us through our Contact page. We are committed to resolving any privacy concerns you may have.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
