import React from 'react';
import { FaSearch } from "react-icons/fa";  // Import the search icon
// import HeroSection from './HeroSection';
// import InfoSection from './InfoSection';
// import ProductsSection from './ProductsSection';
// import Testimonials from './Testimonials';
import Header from './Header';
import ServicesSlider from './ServicesSlider';
import HorizontalScrollGallery from './ServicesUI';
import FreeGPTs from './FreeGPTs';
import BMVCoinPromo from './BMVCoinPromo';
import OXYGroupCompanies from './OXYGroupCompanies';
import Footer from './Footer';

// You can customize the styling based on your project's requirements
const Landingpage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section>
    <Header/>
      </section>

      {/* Info Section */}
      <section>
       <HorizontalScrollGallery/>
      </section>
      <section>
        <ServicesSlider />
        
      </section>
      <section>
        <FreeGPTs />
      </section>
      <section>
        <BMVCoinPromo />
      </section>
      <section>
        <OXYGroupCompanies />
      </section>

      {/* Products Section */}
      {/* <section>
        <ProductsSection />
      </section> */}

      {/* Testimonials Section */}
      {/* <section>
        <Testimonials />
      </section> */}

      {/* Footer Section */}
      <footer>
        <Footer />
      </footer>

      {/* Example of how to integrate the search icon (you can place it wherever appropriate) */}
      {/* <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <FaSearch size={24} />
      </div> */}
    </>
  );
};

export default Landingpage;
