import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ name, description, imageUrl, dateEarned }) => {
    return (
        <div className="badge" role="article" aria-label={`Badge: ${name}`}>
            {imageUrl && (
                <div className="badge-image">
                    <img src={imageUrl} alt={name} loading="lazy" />
                </div>
            )}
            <div className="badge-content">
                <h2 className="badge-title">{name}</h2>
                <p className="badge-description">{description}</p>
                {dateEarned && (
                    <p className="badge-date">Earned: {new Date(dateEarned).toLocaleDateString()}</p>
                )}
            </div>
        </div>
    );
};

Badge.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    dateEarned: PropTypes.string
};

export default Badge;
