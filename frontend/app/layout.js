import "./globals.css";

export const metadata = {
  title: "AssessIQ",
  description: "AI Assessment Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-white">
      <body className="bg-white text-slate-900 min-h-screen mesh-bg">{children}</body>
    </html>
  );
}
