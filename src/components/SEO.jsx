import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | Harekrushna Behera` : 'Harekrushna Behera | Portfolio'}</title>
      <meta name="description" content={description || "Portfolio of Harekrushna Behera, a Software Developer specializing in interactive and cinematic web experiences."} />
      <meta name="keywords" content={keywords || "Software Developer, Portfolio, React, Three.js, Rive, Harekrushna Behera"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://harekrushna-behera-portfolio.vercel.app/"} />
      <meta property="og:title" content={title || "Harekrushna Behera | Portfolio"} />
      <meta property="og:description" content={description || "Software Developer specializing in interactive and cinematic web experiences."} />
      <meta property="og:image" content={image || "/photo.png"} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || "https://harekrushna-behera-portfolio.vercel.app/"} />
      <meta property="twitter:title" content={title || "Harekrushna Behera | Portfolio"} />
      <meta property="twitter:description" content={description || "Software Developer specializing in interactive and cinematic web experiences."} />
      <meta property="twitter:image" content={image || "/photo.png"} />
    </Helmet>
  );
};

export default SEO;
