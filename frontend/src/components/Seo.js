import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const Seo = ({ 
  title = 'Right Tech Centre | Affordable Tech Certifications, Diplomas & Degrees',
  description = 'Empowering your digital journey with cutting-edge technology education. Master in-demand skills with our self-paced programs in AI, Web3, Cybersecurity, and more.',
  keywords = 'tech education, programming courses, cybersecurity certification, AI diploma, computer science degree, affordable tech degrees, online learning',
  image = '/images/og-image.jpg',
  canonical,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData
}) => {
  const location = useLocation();
  const siteUrl = 'https://righttechcentre-iyysq.ondigitalocean.app';
  const currentUrl = `${siteUrl}${location.pathname}${location.search}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Right Tech Centre',
    description: 'Premier online tech education offering certifications, diplomas & degrees in AI, Web Development, Cybersecurity',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.webp`,
    sameAs: [
      'https://www.facebook.com/share/1P2ydiamxx/',
      'https://x.com/righttechcentre',
      'https://www.linkedin.com/in/right-tech-centre-368213369',
      'https://www.youtube.com/@RightTechCentre'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'VGFM+98, North Gudele',
      addressLocality: 'Juba',
      addressCountry: 'South Sudan'
    }
  };

  const mergedStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical || currentUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Right Tech Centre" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@righttechcentre" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#4f46e5" />
      <meta name="robots" content="index, follow" />
      
      {/* Favicon */}
      <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
    </Helmet>
  );
};

export default Seo;
