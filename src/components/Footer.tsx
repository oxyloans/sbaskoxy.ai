import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Apple, PlayCircle, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import Logo from "../assets/img/askoxylogostatic.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      href: "https://www.facebook.com/profile.php?id=61572388385568",
      label: "Facebook",
      hoverColor: "hover:text-blue-600"
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://www.instagram.com/askoxy.ai/",
      label: "Instagram",
      hoverColor: "hover:text-pink-600"
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/askoxy-ai-5a2157349/",
      label: "LinkedIn",
      hoverColor: "hover:text-blue-700"
    }
  ];

  const services = [
    { name: 'Free Rudraksha', path: '/dashboard?section=freerudraksha' },
    { name: 'Free AI & GEN AI Training', path: '/dashboard?section=free-ai-gen-ai' },
    { name: 'Legal Knowledge Hub', path: '/dashboard?section=legal-service' },
    { name: 'Study Abroad', path: '/dashboard?section=study-abroad' },
    { name: 'My Rotary', path: '/dashboard?section=my-rotary' },
    { name: 'We are hiring', path: '/dashboard?section=we-are-hiring' }
  ];

 const contactInfo = [
  {
    icon: <MapPin className="h-5 w-5" />,
    content: (
      <>
        <strong>OXYKART TECHNOLOGIES PVT LTD</strong>
        <br />
        CC-02, Ground Floor, Block-C, Indu Fortune Fields, The Annexe Phase-13, 
        KPHB Colony, K P H B Phase 9, Kukatpally, Hyderabad, Telangana - 500085
      </>
    ),
    type: "text",
  },

    {
      icon: <Mail className="h-5 w-5" />,
      content: "support@askoxy.ai",
      type: "email"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      content: "+91 98765 43210",
      type: "phone"
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center justify-start">
              <img
                src={Logo}
                alt="AskOxy.AI Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              AskOxy.AI delivers boundless freedom with unlimited ChatGPT prompts,
              empowering learners, researchers, and businesses to innovate without
              cost constraints.
            </p>

            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-500 hover:text-black transition-colors duration-300 ${social.hoverColor}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Our Services</h3>
            <nav className="space-y-3">
              {services.map((service) => (
                <a
                  key={service.name}
                  href={service.path}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                >
                  <div className="flex items-center">
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
                      {service.name}
                    </span>
                  </div>
                </a>
              ))}
            </nav>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-900">Contact Us</h3>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-blue-600 mt-1">{info.icon}</div>
                  {info.type === "text" ? (
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {info.content}
                    </p>
                  ) : (
                    <a
                      href={`${info.type === "email" ? "mailto:" : "tel:"}${info.content}`}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      {info.content}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App */}
          <div className="bg-gray-100 rounded-lg p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Get Our App</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download AskOxy.AI mobile app for seamless experience
            </p>
            <div className="space-y-3">
              <a
                href="https://apps.apple.com/in/app/oxyrice-rice-grocery-delivery/id6738732000"
                className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200"
              >
                <Apple className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
                className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Google Play</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              &copy; {currentYear} <span className="font-semibold">ASKOXY.AI</span>. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              CIN: U72900TG2020PTC142391
            </div>
            <div className="flex items-center space-x-4">
              {[
                { name: "Privacy Policy", path: "/privacypolicy" },
                { name: "Terms of Service", path: "/terms" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;