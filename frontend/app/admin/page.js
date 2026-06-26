"use client";

import Hero from "./home/Hero";
import Features from "./home/Features";

import AdminFooter from "./home/AdminFooter";

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Features />
    
      <AdminFooter />
    </div>
  );
}