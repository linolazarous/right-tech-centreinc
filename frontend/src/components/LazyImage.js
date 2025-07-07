import React, { useState } from "react";
import PropTypes from 'prop-types';

const LazyImage = ({ src, alt, width, height, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`lazy-image-container ${className}`}>
      {!loaded && !error && (
        <div 
          className="image-placeholder"
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        className={`lazy-image ${loaded ? 'loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ display: loaded && !error ? 'block' : 'none' }}
      />
      {error && (
        <div className="image-error" style={{ width, height }}>
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

LazyImage.defaultProps = {
  width: '100%',
  height: 'auto',
  className: ''
};

export default LazyImage;
