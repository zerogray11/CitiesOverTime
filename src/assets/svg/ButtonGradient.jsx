const ButtonGradient = () => {
  return (
    <svg className="block" width={0} height={0}>
      <defs>
        {/* Left Gradient: Deep Blue to Light Teal */}
        <linearGradient id="btn-left" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(63, 94, 251, 1)" /> {/* Deep blue */}
          <stop offset="100%" stopColor="rgba(90, 145, 255, 1)" /> {/* Soft light blue */}
        </linearGradient>

        {/* Top Gradient: Purple to Light Yellow */}
        <linearGradient id="btn-top" x1="100%" x2="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="rgba(216, 124, 238, 1)" /> {/* Purple */}
          <stop offset="100%" stopColor="rgba(240, 54, 255, 1)" /> {/* Bright magenta */}
        </linearGradient>

        {/* Bottom Gradient: Light Blue to Teal */}
        <linearGradient id="btn-bottom" x1="100%" x2="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="rgba(90, 153, 252, 1)" /> {/* Light blue */}
          <stop offset="100%" stopColor="rgba(63, 94, 251, 1)" /> {/* Deep blue */}
        </linearGradient>

        {/* Right Gradient: Soft Blue to Purple */}
        <linearGradient id="btn-right" x1="14.635%" x2="14.635%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(90, 153, 252, 1)" /> {/* Light blue */}
          <stop offset="100%" stopColor="rgba(216, 124, 238, 1)" /> {/* Purple */}
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ButtonGradient;

