import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Music,
  ChevronDown,
  FileText,
  Shield,
  Users,
  Mail,
  AlertTriangle,
  BookOpen,
  Wrench,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SiteLayoutProps {
  children: React.ReactNode;
}

const legalPages = [
  { href: "/privacy-policy", label: "Privacy Policy", icon: Shield, testId: "link-footer-privacy" },
  { href: "/terms-of-service", label: "Terms of Service", icon: FileText, testId: "link-footer-terms" },
  { href: "/about", label: "About Us", icon: Users, testId: "link-footer-about" },
  { href: "/contact", label: "Contact", icon: Mail, testId: "link-footer-contact" },
  { href: "/disclaimer", label: "Disclaimer", icon: AlertTriangle, testId: "link-footer-disclaimer" },
];

const toolsPages = [
  { href: "/tools/youtube-to-mp3-guide", label: "Complete YouTube to MP3 Guide", icon: BookOpen, testId: "link-tools-guide" },
];

export function SiteLayout({ children }: SiteLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-logo">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Music className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">YT2MP3</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                <Link href="/" data-testid="link-nav-converter">
                  <Button 
                    variant={location === "/" ? "secondary" : "ghost"} 
                    size="sm"
                    data-testid="button-nav-converter"
                  >
                    Converter
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1" data-testid="button-tools-dropdown">
                      <Wrench className="w-4 h-4" />
                      Tools
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {toolsPages.map((page) => (
                      <DropdownMenuItem key={page.href} asChild>
                        <Link href={page.href} className="flex items-center gap-2 cursor-pointer" data-testid={page.testId}>
                          <page.icon className="w-4 h-4" />
                          {page.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1" data-testid="button-mobile-menu">
                      Menu
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center gap-2 cursor-pointer" data-testid="link-mobile-converter">
                        <Music className="w-4 h-4" />
                        Converter
                      </Link>
                    </DropdownMenuItem>
                    {toolsPages.map((page) => (
                      <DropdownMenuItem key={page.href} asChild>
                        <Link href={page.href} className="flex items-center gap-2 cursor-pointer" data-testid={`mobile-${page.testId}`}>
                          <page.icon className="w-4 h-4" />
                          {page.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-muted/30" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Music className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">YT2MP3</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Convert YouTube videos to high-quality MP3 audio files. Fast, free, and no registration required.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm" aria-label="Quick links">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                    YouTube to MP3 Converter
                  </Link>
                </li>
                {toolsPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`footer-${page.testId}`}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm" aria-label="Legal links">
                {legalPages.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="text-muted-foreground hover:text-foreground transition-colors" data-testid={page.testId}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm" aria-label="Support links">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-support-contact">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-support-about">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} YT2MP3. All rights reserved.</p>
            <p className="mt-2">
              This service is for personal use only. Please respect copyright laws and YouTube's Terms of Service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
