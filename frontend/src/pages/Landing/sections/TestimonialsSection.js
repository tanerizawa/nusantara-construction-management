import React from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../config/contentData';
import { useTestimonialCarousel } from '../hooks/useLandingData';

export const TestimonialsSection = ({ className = '' }) => {
  const {
    activeTestimonial,
    goToTestimonial,
    nextTestimonial,
    prevTestimonial,
    isAutoRotating
  } = useTestimonialCarousel(TESTIMONIALS_DATA);

  return (
    <section 
      id="testimonials" 
      className={`py-16 bg-white ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Testimoni Klien
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kepercayaan dan kepuasan klien adalah prioritas utama kami
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <TestimonialCard 
            testimonial={TESTIMONIALS_DATA[activeTestimonial]} 
          />
          
          {/* Navigation Controls */}
          <TestimonialControls 
            testimonials={TESTIMONIALS_DATA}
            activeIndex={activeTestimonial}
            onGoTo={goToTestimonial}
            onNext={nextTestimonial}
            onPrev={prevTestimonial}
            isAutoRotating={isAutoRotating}
          />
        </div>

        {/* Testimonial Stats */}
        <TestimonialStats />
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 relative overflow-hidden">
    {/* Quote Icon */}
    <div className="absolute top-8 left-8 opacity-10">
      <Quote size={80} className="text-blue-600" />
    </div>
    
    <div className="relative z-10">
      {/* Rating Stars */}
      <div className="flex items-center justify-center mb-8">
        {[...Array(testimonial.rating)].map((_, index) => (
          <Star 
            key={index} 
            size={24} 
            className="text-yellow-400 fill-current" 
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed text-center mb-8">
        "{testimonial.quote}"
      </blockquote>

      {/* Author Info */}
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900 mb-1">
          {testimonial.name}
        </div>
        <div className="text-blue-600 font-semibold mb-1">
          {testimonial.role}
        </div>
        <div className="text-gray-600 mb-4">
          {testimonial.company}
        </div>
        
        {/* Project Badge */}
        <div className="inline-block bg-white px-4 py-2 rounded-full border border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            Proyek: {testimonial.project}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialControls = ({ 
  testimonials, 
  activeIndex, 
  onGoTo, 
  onNext, 
  onPrev, 
  isAutoRotating 
}) => (
  <div className="flex items-center justify-center mt-8 space-x-4">
    {/* Previous Button */}
    <button
      onClick={onPrev}
      className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
    >
      <ChevronLeft size={20} className="text-gray-600 group-hover:text-blue-600" />
    </button>

    {/* Dots Indicator */}
    <div className="flex space-x-2">
      {testimonials.map((_, index) => (
        <button
          key={index}
          onClick={() => onGoTo(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === activeIndex 
              ? 'bg-blue-600 scale-125' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        />
      ))}
    </div>

    {/* Next Button */}
    <button
      onClick={onNext}
      className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
    >
      <ChevronRight size={20} className="text-gray-600 group-hover:text-blue-600" />
    </button>

    {/* Auto-rotation Indicator */}
    {isAutoRotating && (
      <div className="ml-4 flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Auto</span>
      </div>
    )}
  </div>
);

const TestimonialStats = () => {
  const stats = [
    { value: '100%', label: 'Tingkat Kepuasan', color: 'text-green-600' },
    { value: '5.0', label: 'Rating Rata-rata', color: 'text-yellow-600' },
    { value: '95%', label: 'Repeat Client', color: 'text-blue-600' },
    { value: '24/7', label: 'Customer Support', color: 'text-purple-600' }
  ];

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-gray-600 font-semibold">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsSection;