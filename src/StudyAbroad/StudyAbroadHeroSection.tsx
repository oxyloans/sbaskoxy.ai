import React, { useState, useEffect } from "react";
import { ArrowRight, Globe, BookOpen, GraduationCap, MapPin, Briefcase, Award } from "lucide-react";

function StudyAbroadHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [studentAnimation, setStudentAnimation] = useState("idle");
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
    
    // Student animation cycle
    const studentAnimationInterval = setInterval(() => {
      setStudentAnimation(prev => {
        if (prev === "idle") return "pointing";
        if (prev === "pointing") return "thinking";
        if (prev === "thinking") return "celebrating";
        return "idle";
      });
    }, 3000);
    
    return () => {
      clearInterval(typingInterval);
      clearInterval(repeatInterval);
      clearInterval(studentAnimationInterval);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content - Larger */}
          <div className={`lg:col-span-6 space-y-6 text-center lg:text-left transform transition-all duration-700 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">
                  {typedText}
                  <span className={`inline-block w-1 h-8 bg-purple-600 ml-1 ${isTypingComplete ? 'animate-pulse' : ''}`}></span>
                </span>
              </h1>
              <p className="text-purple-600 font-medium text-lg md:text-xl">world's 1st AI & Blockchain based platform for university admissions.</p>
            </div>

            <p className="text-gray-600 text-lg">
              To enable <strong>1 million students</strong> to fulfill their abroad dream by 2030.
              Our vision is to connect all stakeholders seamlessly with high trust. 
              <p className="text-purple-600 text-lg mt-2"><strong>7 countries</strong> with <strong>95% visa success rate</strong>.</p>
              
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

          {/* Right Content - Enhanced Animated Student */}
          <div className={`lg:col-span-6 flex justify-center items-center transition-all duration-700 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="w-full max-w-md">
              {/* Animated interactive scene */}
              <div className="relative bg-white rounded-xl shadow-xl p-4 overflow-hidden h-96">
                {/* World map background */}
                <div className="absolute inset-0 opacity-10 bg-purple-900">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200 via-purple-100 to-transparent"></div>
                </div>
                
                {/* Animated globe */}
                <div className="absolute top-4 right-4 w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 animate-pulse"></div>
                  <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-white rounded-full rotate-45"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white animate-spin-slow" style={{animationDuration: '20s'}} />
                  </div>
                </div>
                
                {/* Student figure */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-72 w-40 flex justify-center">
                  {/* Student body - animated based on state */}
                  <div className={`absolute bottom-0 w-full transition-all duration-500 ease-in-out
                    ${studentAnimation === 'idle' ? 'scale-100' : ''}
                    ${studentAnimation === 'pointing' ? 'scale-105' : ''}
                    ${studentAnimation === 'thinking' ? 'scale-100 -rotate-3' : ''}
                    ${studentAnimation === 'celebrating' ? 'scale-110 translate-y-2' : ''}
                  `}>
                    {/* Body */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-48 bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-3xl"></div>
                    
                    {/* Head */}
                    <div className="absolute bottom-48 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-amber-300 rounded-full">
                      {/* Face features */}
                      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-purple-900 rounded-full"></div>
                      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-900 rounded-full"></div>
                      <div className={`absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-purple-900 rounded-full
                        ${studentAnimation === 'celebrating' ? 'h-3 rounded-t-xl' : ''}
                      `}></div>
                    </div>
                    
                    {/* Graduation cap */}
                    <div className="absolute bottom-64 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="relative">
                        <div className="w-24 h-6 bg-purple-900 rounded"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-900 rotate-45"></div>
                        <div className="absolute top-0 right-0 w-2 h-12 bg-amber-400"></div>
                        <div className="absolute top-0 right-0 w-5 h-5 bg-amber-400 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Arms */}
                    <div className={`absolute bottom-32 left-0 w-12 h-4 bg-indigo-600 rounded-full transform origin-right 
                      ${studentAnimation === 'pointing' ? 'rotate-[-30deg] translate-x-2' : 'rotate-[-10deg]'}
                      ${studentAnimation === 'thinking' ? 'rotate-[-45deg] translate-x-1 translate-y-2' : ''}
                      ${studentAnimation === 'celebrating' ? 'rotate-[-60deg] translate-y-4' : ''}
                    `}></div>
                    <div className={`absolute bottom-32 right-0 w-12 h-4 bg-indigo-600 rounded-full transform origin-left 
                      ${studentAnimation === 'pointing' ? 'rotate-[45deg] translate-x-6 translate-y-4' : 'rotate-[10deg]'}
                      ${studentAnimation === 'thinking' ? 'rotate-[60deg] translate-y-3 translate-x-2' : ''}
                      ${studentAnimation === 'celebrating' ? 'rotate-[60deg] translate-y-4' : ''}
                    `}></div>
                  </div>
                  
                  {/* Book or other props based on animation state */}
                  <div className={`absolute transition-all duration-500 ease-in-out
                    ${studentAnimation === 'thinking' ? 'opacity-100 bottom-36 left-10 transform -rotate-12' : 'opacity-0'}
                  `}>
                    <BookOpen className="w-10 h-10 text-amber-500 drop-shadow-md" />
                  </div>
                  
                  {/* Speech bubble */}
                  <div className={`absolute transition-all duration-500 ease-in-out 
                    ${studentAnimation === 'pointing' || studentAnimation === 'celebrating' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    ${studentAnimation === 'pointing' ? 'bottom-72 right-0' : 'bottom-72 left-0'}
                  `}>
                    <div className="relative bg-white rounded-lg p-2 shadow-md">
                      <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white"></div>
                      <p className="text-xs font-bold text-purple-700 whitespace-nowrap">
                        {studentAnimation === 'pointing' ? "Study abroad!" : "I got accepted!"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating country signs */}
                <div className="absolute top-1/4 left-1/6 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 rounded-lg shadow-md text-xs font-bold text-white animate-float" style={{animationDuration: '3s', animationDelay: '0.5s'}}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>USA</span>
                  </div>
                </div>
                
                <div className="absolute top-1/3 right-1/6 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 rounded-lg shadow-md text-xs font-bold text-white animate-float" style={{animationDuration: '4s', animationDelay: '1.2s'}}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>UK</span>
                  </div>
                </div>
                
                <div className="absolute bottom-1/3 left-1/4 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 rounded-lg shadow-md text-xs font-bold text-white animate-float" style={{animationDuration: '3.5s', animationDelay: '0.8s'}}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Canada</span>
                  </div>
                </div>
                
                <div className="absolute bottom-1/4 right-1/4 bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 rounded-lg shadow-md text-xs font-bold text-white animate-float" style={{animationDuration: '4.2s', animationDelay: '1.5s'}}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Australia</span>
                  </div>
                </div>
                
                {/* Floating icons */}
                <div className="absolute top-20 left-1/4 bg-white p-2 rounded-full shadow-md animate-float" style={{animationDuration: '4s', animationDelay: '0.2s'}}>
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                
                <div className="absolute bottom-1/2 right-1/5 bg-white p-2 rounded-full shadow-md animate-float" style={{animationDuration: '3.8s', animationDelay: '1s'}}>
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                
                <div className="absolute bottom-20 left-1/3 bg-white p-2 rounded-full shadow-md animate-float" style={{animationDuration: '3.5s', animationDelay: '1.7s'}}>
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudyAbroadHeroSection;