import { Karla } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/sidebar/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Issue Tracker", // Adds " | Issue Tracker" to child page titles automatically
    default: "Issue Tracker", // The title when on the home page
  },
  description:
    "A full-stack issue tracking application built with Next.js, React Query, and Tailwind CSS.",
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon in your 'public' folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ^ suppressHydrationWarning is needed for next-themes to work without errors */}
      <body className={`${karla.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          {/* 2. Add the Toaster here, at the bottom */}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
