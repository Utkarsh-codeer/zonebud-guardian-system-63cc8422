import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to ZoneBud',
      description: 'Your comprehensive zone management solution for industrial and commercial teams.',
      icon: '🏗️',
    },
    {
      title: 'Track Zone Presence',
      description: 'Monitor team members in real-time with GPS tracking and geofencing technology.',
      icon: '📍',
    },
    {
      title: 'Report Safety Hazards',
      description: 'Quickly report and track safety hazards with photos, videos, and detailed descriptions.',
      icon: '⚠️',
    },
    {
      title: 'Manage Documents',
      description: 'Share and organize safety documents, procedures, and important files.',
      icon: '📋',
    },
    {
      title: 'Stay Connected',
      description: 'Receive real-time notifications and broadcast messages from your team.',
      icon: '📢',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] px-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-xl border-none">
        <CardContent className="p-10">
          <div className="text-center">
            <div className="text-[5.5rem] mb-8">{slides[currentSlide].icon}</div>
            <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-10 text-base max-w-xl mx-auto">
              {slides[currentSlide].description}
            </p>

            <div className="flex justify-center space-x-3 mb-10">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                    index === currentSlide ? 'bg-[#007AFF]' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center max-w-sm mx-auto">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="px-6 py-2 rounded-lg text-sm font-semibold"
              >
                Previous
              </Button>

              {currentSlide === slides.length - 1 ? (
                <Link to="/login" className="w-full">
                  <Button className="px-6 py-2 rounded-lg text-sm font-semibold w-full">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={nextSlide}
                  className="px-6 py-2 rounded-lg text-sm font-semibold"
                >
                  Next
                </Button>
              )}
            </div>

            <div className="mt-8">
              <Link
                to="/login"
                className="text-[#007AFF] hover:underline text-sm font-medium"
              >
                Skip tour and sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
