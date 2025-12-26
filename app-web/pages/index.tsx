import { Geist, Geist_Mono, Inter, Anton } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} ${inter.className} ${anton.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    ></div>
  );
}
