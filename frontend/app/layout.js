import "./globals.css";
 
export const metadata = {
  title: "AssessIQ",
  description: "AI Assessment Platform",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}