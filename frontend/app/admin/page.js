"use client";

import Hero from "./home/Hero";
import Features from "./home/Features";
import Stats from "./home/Stats";
import AdminFooter from "./home/AdminFooter";

const AdminHome = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Stats />
      <AdminFooter />
    </div>
  );
};

export default AdminHome;