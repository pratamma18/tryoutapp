<<<<<<< HEAD

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin']
});
=======
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

>>>>>>> 5e06176eb4014e5f90154783ec7aa0f7665779a4
export const metadata = {
  title: "TryoutApp",
  description: "TryoutApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={roboto.className}>{children}</body>
=======
      <body className={inter.className}>{children}</body>
>>>>>>> 5e06176eb4014e5f90154783ec7aa0f7665779a4
    </html>
  );
}
