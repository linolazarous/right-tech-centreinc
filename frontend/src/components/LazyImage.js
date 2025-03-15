import React from "react";

const LazyImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
  />
);

export default LazyImage;