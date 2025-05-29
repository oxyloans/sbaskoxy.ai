import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, Calendar, Users, BookOpen, Heart, Star, ChevronRight } from 'lucide-react';

const Support = () => {
  const [activeSupport, setActiveSupport] = useState('counselor');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    concern: '',
    urgency: 'normal'
  });

  const supportTypes = [
    {
      id: 'counselor',
      title: 'Counselor Support',
      icon: MessageCircle,
      description: 'Get expert guidance from experienced counselors',
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 'academic',
      title: 'Academic Help',
      icon: BookOpen,
      description: 'Subject-specific tutoring and study assistance',
      color: 'from-blue-500 to-indigo-500'
    },
    // {
    //   id: 'wellness',
    //   title: 'Mental Wellness',
    //   icon: Heart,
    //   description: 'Mental health support and wellness resources',
    //   color: 'from-pink-500 to-rose-500'
    // },
    // {
    //   id: 'peer',
    //   title: 'Peer Support',
    //   icon: Users,
    //   description: 'Connect with fellow students for support',
    //   color: 'from-green-500 to-emerald-500'
    // }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      rating: 5,
      text: 'The counselor helped me manage my anxiety and improve my study habits. Highly recommended!'
    },
    {
      name: 'Alex K.',
      rating: 5,
      text: 'Great support system. The academic help sessions really boosted my confidence.'
    },
    {
      name: 'Maya P.',
      rating: 5,
      text: 'Wonderful experience with the mental wellness program. Feeling much better now.'
    }
  ];

  const handleFormSubmit = () => {
    // Handle form submission logic here
    if (consultationForm.name && consultationForm.email && consultationForm.phone && consultationForm.concern) {
      alert('Consultation request submitted successfully!');
      // Reset form
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        concern: '',
        urgency: 'normal'
      });
      setSelectedTimeSlot('');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setConsultationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Student <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you succeed. Choose from our comprehensive support services designed for your academic and personal growth.
          </p>
        </div>

        {/* Support Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          {supportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setActiveSupport(type.id)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeSupport === type.id
                    ? 'bg-white shadow-xl border-2 border-violet-200'
                    : 'bg-white/70 shadow-lg hover:shadow-xl border border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
                {activeSupport === type.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Support Content */}
          <div className="lg:col-span-2">
            {activeSupport === 'counselor' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Professional Counselor Support
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Connect with our licensed counselors for personalized guidance on academic, personal, and career matters.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <button className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                    <Calendar className="w-5 h-5" />
                    <span>Book Session</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300 font-medium border border-blue-200">
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all duration-300 font-medium border border-green-200">
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </button>
                </div>

                {/* Time Slot Selection */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Available Time Slots</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-3 rounded-lg text-center transition-all duration-300 ${
                          selectedTimeSlot === slot
                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-sm font-medium">{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultation Form */}
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-gray-900">Schedule Your Consultation</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-gray-700 mb-2">Full Name</div>
                      <input
                        type="text"
                        value={consultationForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <div className="block text-sm font-medium text-gray-700 mb-2">Email</div>
                      <input
                        type="email"
                        value={consultationForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">Phone Number</div>
                    <input
                      type="tel"
                      value={consultationForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">Concern/Topic</div>
                    <textarea
                      value={consultationForm.concern}
                      onChange={(e) => handleInputChange('concern', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                      placeholder="Briefly describe what you'd like to discuss..."
                    />
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</div>
                    <select
                      value={consultationForm.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <button
                    onClick={handleFormSubmit}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Schedule Consultation
                  </button>
                </div>
              </div>
            )}

            {/* Other support types content would go here */}
            {activeSupport !== 'counselor' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
                <p className="text-gray-600 mb-6">
                  We're working on bringing you the best {supportTypes.find(t => t.id === activeSupport)?.title.toLowerCase()} experience.
                </p>
                <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                  Get Notified
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">Crisis Hotline</div>
                    <div className="text-sm text-red-700">Available 24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">support@university.edu</div>
                    <div className="text-sm text-blue-700">General inquiries</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">What Students Say</h4>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">"{testimonial.text}"</p>
                    <div className="text-xs text-gray-500 font-medium">- {testimonial.name}</div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Quick Resources */}
            {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Resources</h4>
              <div className="space-y-2">
                {['Study Tips', 'Stress Management', 'Time Management', 'Career Guidance'].map((resource) => (
                  <button
                    key={resource}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-gray-700">{resource}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;