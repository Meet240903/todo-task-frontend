import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/fadein.css'; // Import the CSS file for styles

const FadeComponent = ({ children, duration, delay, className, direction }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={`${className} fade-in fade-${direction} ${isVisible ? 'visible' : ''}`}
      style={{ transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out` }}
    >
      {children}
    </div>
  );
};

FadeComponent.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  delay: PropTypes.number,
  className: PropTypes.string,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
};

FadeComponent.defaultProps = {
  duration: 1000, // Default duration of 1 second
  delay: 0, // Default delay of 0 seconds
  className: '',
  direction: 'up', // Default direction is up
};

export default FadeComponent;
