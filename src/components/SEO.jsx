import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteUrl = "https://harekrushna-behera-portfolio.vercel.app";
  const fullTitle = title ? `${title} | Harekrushna Behera` : 'Harekrushna Behera | Software Developer & Creative Engineer';
  const defaultDesc = "Explore the interactive portfolio of Harekrushna Behera, a Software Developer specializing in React, Three.js, and cinematic web experiences. View full-stack projects, technical expertise, and developer-focused tools.";
  const fullDescription = description || defaultDesc;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/photo.png`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Harekrushna Behera",
    "url": siteUrl,
    "jobTitle": "Software Developer",
    "description": fullDescription,
    "sameAs": [
      "https://github.com/krush-codem",
      "https://linkedin.com/in/harekrushnabehera121"
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords || "Harekrushna Behera, HKB, Software Developer, Portfolio, React Developer, Three.js, Full Stack Engineer, Creative Coding, Interactive UI"} />
      <meta name="author" content="Harekrushna Behera" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Harekrushna Behera Portfolio" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:creator" content="@_harekrushna_" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
