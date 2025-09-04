import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from '@/context/AuthContext'
import { Providers } from "./providers";

export const metadata = {
  title: "My App",
  description: "Next.js Auth Example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Providers>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
