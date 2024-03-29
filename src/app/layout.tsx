import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cn(inter.className, "min-h-screen flex flex-col")} dark`}
      >
        <div className="w-full p-3 flex gap-2 bg-gray-800">
          <Image
            src={"/weather.png"}
            alt="logo"
            width={20}
            height={20}
            className="rounded overflow-hidden w-fit"
          />
          <h1 className="font-bold text-white">Weather App</h1>
        </div>
        {children}
      </body>
    </html>
  );
}
