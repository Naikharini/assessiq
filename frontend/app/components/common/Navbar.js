import Link from "next/link";
import Image from "next/image";
 
export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo Left */}
        <Link href="/">
          <Image
            src="/Logo.png"
            alt="AssessIQ Logo"
            width={160}
            height={40}
            priority
          />
        </Link>
 
        {/* Buttons Right */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-blue-100 transition">
              Login
            </button>
          </Link>
 
          <Link href="/signup">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}