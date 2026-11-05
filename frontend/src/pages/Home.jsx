import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import LiveStreamBanner from "@/components/home/LiveStreamBanner";
import ConnectCards from "@/components/home/ConnectCards";
import FeaturedMedia from "@/components/home/FeaturedMedia";
import AlternatingSection from "@/components/home/AlternatingSection";
import ServiceTimesSection from "@/components/home/ServiceTimesSection";

const Home = () => {
  return (
    <Layout>
      <LiveStreamBanner />
      <HeroSection />

      <ConnectCards />

      <AlternatingSection
        title="Welcome Home"
        subtitle="Our Story"
        description="Power of Praise Deliverance Center is a place where you can experience the love of God, grow in your faith, and connect with a family of believers. We are dedicated to sharing the life-changing message of Jesus Christ and making a positive impact in our community."
        image="/worship-background.webp"
        linkText="Read Our Full Story"
        linkPath="/about"
        badge="About Us"
        isReversed={false}
      />

      <FeaturedMedia />

      <AlternatingSection
        title="Next Generation"
        subtitle="Youth & Kids"
        description="We believe in empowering the next generation to be bold leaders for Christ. Our youth and children's ministries provide a safe, fun, and engaging environment where kids can learn about God's love and develop a strong foundation for their faith."
        image="/church-logo.jpg"
        linkText="Explore Ministries"
        linkPath="/services"
        badge="Ministries"
        isReversed={true}
      />

      <AlternatingSection
        title="Join a Connect Group"
        subtitle="Community"
        description="Life is better together. Connect Groups are the heart of our church, where you can build meaningful relationships, find support, and grow spiritually alongside others. There's a group for every age and stage of life."
        image="/worship-background.webp"
        linkText="Find Your Group"
        linkPath="/contact"
        badge="Fellowship"
        isReversed={false}
      />

      <ServiceTimesSection />
    </Layout>
  );
};

export default Home;
