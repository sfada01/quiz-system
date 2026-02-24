import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider }  from "@/context/ThemeContext";
import { QuizProvider }   from "@/context/QuizContext";
import { UserProvider }   from "@/context/UserContext";
import { SoundProvider }  from "@/context/SoundContext";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "QuizOS — Course-Based Quiz System",
  description: "Test your knowledge across mathematics, biology, history, CS and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <SoundProvider>
            <UserProvider>
              <QuizProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
              </QuizProvider>
            </UserProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}