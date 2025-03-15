import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContentLocalization from "../components/ContentLocalization";

const ContentLocalizationPage = () => {
  return (
    <div>
      <Navbar />
      <h1>Content Localization</h1>
      <ContentLocalization />
      <Footer />
    </div>
  );
};

export default ContentLocalizationPage;