"use client";
import Footer from "../components/common/Footer";
import Hero from "./home/Hero";
import Features from "./home/Features";
import Howitworks from "./home/Howitworks";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Howitworks />
      <Footer />
    </div>
  );
};

export default Home;