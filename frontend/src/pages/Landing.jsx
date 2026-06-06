import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CoursesShowcase from '../components/CoursesShowcase';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CoursesShowcase />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

export default Landing;
