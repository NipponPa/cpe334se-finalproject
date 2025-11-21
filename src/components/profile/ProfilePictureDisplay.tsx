import React from 'react';

interface ProfilePictureDisplayProps {
  imageUrl: string | null;
  altText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  defaultText?: string;
}

const ProfilePictureDisplay: React.FC<ProfilePictureDisplayProps> = ({
  imageUrl,
  altText = 'Profile Picture',
  size = 'md',
  className = '',
  defaultText
}) => {
  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Get the appropriate initials if no image is provided
  const getInitials = () => {
    if (defaultText) {
      const words = defaultText.split(' ');
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      } else if (words.length === 1) {
        return words[0][0].toUpperCase();
      }
    }
    return '?';
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-300`}
          onError={(e) => {
            // If image fails to load, show initials instead
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const initialsDiv = parent.querySelector('.initials-display');
              if (initialsDiv) {
                initialsDiv.setAttribute('style', 'display: flex;');
              }
            }
          }}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300`}>
          <span className="text-gray-700 font-medium">
            {getInitials()}
          </span>
        </div>
      )}
      
      {/* Initials fallback that shows when image fails */}
      <div 
        className={`initials-display absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 ${imageUrl ? 'hidden' : 'flex'}`}
      >
        <span className="text-gray-700 font-medium">
          {getInitials()}
        </span>
      </div>
    </div>
  );
};

export default ProfilePictureDisplay;