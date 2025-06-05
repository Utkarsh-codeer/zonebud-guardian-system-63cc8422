
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-6">{slides[currentSlide].icon}</div>
            <h2 className="text-2xl font-bold mb-4">{slides[currentSlide].title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {slides[currentSlide].description}
            </p>

            <div className="flex justify-center space-x-2 mb-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                Previous
              </Button>

              {currentSlide === slides.length - 1 ? (
                <Link to="/login">
                  <Button>Get Started</Button>
                </Link>
              ) : (
                <Button onClick={nextSlide}>Next</Button>
              )}
            </div>

            <div className="mt-6">
              <Link to="/login" className="text-primary hover:underline text-sm">
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
