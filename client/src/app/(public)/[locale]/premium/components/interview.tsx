'use client';

import { FeatureComparison } from "./feature-comparison";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Shield } from "lucide-react";

export default function Interview() {


  const scrollToPremium = () => {
    const premiumSection = document.getElementById('premium-section');
    if (premiumSection) {
      premiumSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-100 to-rose-100 px-4 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
        <div className="max-w-3xl mx-auto relative">
          <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
            45,000 VND for unlimited art experiences
          </h1>
          <p className="text-black/80 mb-8 text-lg">
            Enjoy the highest quality images, unlimited gallery views and many other benefits. Cancel anytime.
          </p>
          <Button onClick={scrollToPremium} size="lg" className="bg-black hover:bg-black/90 text-white px-8 py-6 rounded-full text-lg font-medium transition-all hover:scale-105">
            Get Premium Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors">
            <Star className="h-12 w-12 mx-auto mb-4 text-rose-500" />
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Access to highest resolution artworks and exclusive collections</p>
          </div>
          <div className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors">
            <Users className="h-12 w-12 mx-auto mb-4 text-rose-500" />
            <h3 className="text-xl font-semibold mb-2">Community Access</h3>
            <p className="text-gray-600">Connect with artists and art enthusiasts worldwide</p>
          </div>
          <div className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors">
            <Shield className="h-12 w-12 mx-auto mb-4 text-rose-500" />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-600">Your data and transactions are always protected</p>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div id="premium-section" className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
          <FeatureComparison />
        </div>
      </div>
    </div>
  );
}