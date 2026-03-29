import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { NavigationEvents } from "@/components/providers/navigation-events";
import { GlobalLoader } from "@/components/ui/global-loader";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Finuva",
    template: "%s | Finuva",
  },
  description: "Modern invoicing & billing for your business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sans.variable}`}
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <LoadingProvider>
          <NavigationEvents />
          <GlobalLoader />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
