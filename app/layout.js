import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { connectToDatabase } from "@/service/mongo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Edu Connect",
  description: "An educational platform",
};

export default async function RootLayout({ children }) {
  const conn =await connectToDatabase();

  return (
    <html lang="en">
      <body
        className={cn(inter.className,poppins.className)}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
