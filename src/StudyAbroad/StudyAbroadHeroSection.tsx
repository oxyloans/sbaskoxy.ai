import React, { useState, useEffect } from "react";
import { ArrowRight, Globe, BookOpen, GraduationCap, MapPin, Briefcase, Award } from "lucide-react";
import Heroimg from "../assets/img/heroimg3.png"

function StudyAbroadHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullHeadingText = "Your Global Education Journey";

  useEffect(() => {
    setIsVisible(true);
    
    // Typing animation effect that repeats every 45 seconds
    const startTypingAnimation = () => {
      let currentIndex = 0;
      setIsTypingComplete(false);
      setTypedText("");
      
      const typingInterval = setInterval(() => {
        if (currentIndex < fullHeadingText.length) {
          setTypedText(fullHeadingText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, 100); // Speed of typing
      
      return typingInterval;
    };
    
    // Start initial animation
    let typingInterval = startTypingAnimation();
    
    // Restart animation every 45 seconds
    const repeatInterval = setInterval(() => {
      clearInterval(typingInterval);
      typingInterval = startTypingAnimation();
    }, 45000);
    
    return () => {
      clearInterval(typingInterval);
      clearInterval(repeatInterval);
    };
  }, []);

  const handleExploreCountries = () => {
    const countriesSection = document.getElementById("countries");
    if (countriesSection) {
      countriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFreeConsultation = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-purple-50 py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content - Larger */}
          <div className={`lg:col-span-6 space-y-6 lg:text-left transform transition-all duration-700 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">
                  {typedText}
                  <span className={`inline-block w-1 h-8 bg-purple-600 ml-1 ${isTypingComplete ? 'animate-pulse' : ''}`}></span>
                </span>
              </h1>
            </div>

            <p className="text-gray-600 text-lg">
              To enable <strong>1 million students</strong> to fulfill their abroad dream by 2030.
              Our vision is to connect all stakeholders seamlessly with high trust. 
              <p className="text-purple-600 text-lg mt-2"><strong>10+ countries</strong> with <strong>95% visa success rate</strong>.</p>
            </p>
            
            {/* Information box moved from bottom of right panel to left panel */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 text-white shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6" />
                  <span className="font-bold">5,000+ Students Placed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  <span className="font-bold">95% Success Rate</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleExploreCountries}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:from-yellow-600 hover:to-amber-600 shadow-md w-full sm:w-auto text-lg"
              >
                Explore Options
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={handleFreeConsultation}
                className="border-2 border-purple-600 bg-white text-purple-600 font-medium py-3 px-6 rounded-md hover:bg-purple-50 flex items-center justify-center gap-2 w-full sm:w-auto text-lg"
              >
                Free Consultation
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className={`lg:col-span-6 flex justify-center items-center transition-all duration-700 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="w-full h-full">
              {/* Hero Image Container with responsive sizing */}
              <div >
                {/* The image with responsive properties */}
                <img 
                  src={Heroimg}
                  alt="Study Abroad Hero" 
                  className="w-full h-auto object-cover object-center max-h-96 md:max-h-[500px] lg:max-h-[600px] rounded-lg"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudyAbroadHeroSection;