import React, { useState, useEffect } from 'react';
import { ArrowLeft, Factory, TrendingDown, Truck, CheckCircle2, Shield, Award, Users } from 'lucide-react';

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    '/coverphoto2_astro.png',
    '/coverphoto3_astro.png'
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Factory className="w-5 h-5 text-blue-600" />,
      title: "Direct From Factory",
      description: "Skip the middleman! Get factory-fresh fireworks at wholesale prices"
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: "100% Safety Certified",
      description: "All products are safety tested and certified with proper licensing"
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-red-600" />,
      title: "Best Wholesale Rates",
      description: "Guaranteed lowest prices with maximum savings for bulk orders"
    },
    {
      icon: <Truck className="w-5 h-5 text-purple-600" />,
      title: "Fast Delivery",
      description: "Quick and secure delivery across Tamil Nadu"
    },
    {
      icon: <Award className="w-5 h-5 text-orange-600" />,
      title: "Premium Quality",
      description: "Handpicked fireworks from top Sivakasi manufacturers"
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs"
    }
  ];

  const highlights = [
    {
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      text: "Direct Factory Partnership"
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      text: "No Middleman Costs"
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      text: "Wholesale Pricing"
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
      text: "100% Legal Compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full">
        {/* Navigation */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Hero Section - Taller View */}
        <div className="relative h-[550px] overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={image}
                alt={`Astro Crackers ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23ef4444'/><text x='200' y='150' font-family='Arial' font-size='16' fill='white' text-anchor='middle' dominant-baseline='middle'>Image Loading...</text></svg>`;
                }}
              />
            </div>
          ))}

          

          

          {/* Image Indicators */}
          <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Our Story Section - Compact */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Our Story
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p className="text-lg font-medium">
                    Astro Crackers revolutionizes fireworks by creating <span className="text-blue-600 font-bold">direct factory partnerships</span>
                    that eliminate middleman costs and ensure premium quality.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <h3 className="text-base font-bold text-blue-900 mb-2">Why We're Different:</h3>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li className="flex items-center">
                        <Factory className="w-4 h-4 mr-2 text-blue-600" />
                        <span><strong>Direct Factory Source:</strong> We source directly from Sivakasi manufacturers</span>
                      </li>
                      <li className="flex items-center">
                        <TrendingDown className="w-4 h-4 mr-2 text-blue-600" />
                        <span><strong>Zero Middleman Cost:</strong> Pass savings directly to customers</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-600" />
                        <span><strong>Quality Guaranteed:</strong> Every product personally inspected</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-xl text-center">
                  <Factory className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold text-sm mb-1">Direct Factory</h3>
                  <p className="text-xs opacity-90">Sivakasi Partnership</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl text-center">
                  <TrendingDown className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold text-sm mb-1">Best Prices</h3>
                  <p className="text-xs opacity-90">No Middleman Markup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section - Compact */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Why Choose Astro Crackers
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border-t-2 border-blue-600">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Call to Action */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 
                rounded-md shadow-md text-white 
                py-4 px-6 text-center mb-8 w-full">
            <img
              src="logo_astro.png"
              alt="Astro Crackers Logo"
              className="w-10 h-10 mx-auto mb-2 bg-white rounded-full p-1 shadow"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="text-lg md:text-xl font-bold mb-1">
              🎆 Light Up Your Celebration
            </h2>
            <p className="text-sm opacity-90 mb-2">
              Premium fireworks at factory-direct prices
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="/products"
                className="bg-white text-red-600 font-semibold py-2 px-5 rounded-md shadow hover:bg-red-50 transition text-xs"
              >
                Browse
              </a>
              <a
                href="/contact"
                className="border border-white text-white font-semibold py-1.5 px-4 rounded-md shadow hover:bg-white hover:text-red-600 transition text-xs"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Compact Legal Compliance */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-amber-800 mb-2">
                  Legal Compliance & Safety Notice
                </h3>
                <p className="text-amber-700 text-sm leading-relaxed">
                  As per 2018 Supreme Court Order, online sale of firecrackers is not permitted.
                  Please browse our products to get estimates and submit requirements through our contact form.
                  <span className="font-bold"> Astro Crackers follows 100% legal & statutory compliances</span>,
                  and all operations are maintained as per explosive acts with proper licensing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;