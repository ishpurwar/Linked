import React from 'react';
import ImageCarousel from './ImageCarousel';

interface ProfileData {
  name?: string;
  age?: number;
  uri?: string[];
  bio?: string;
  location?: string;
  interests?: string[];
}

interface ProfileCardProps {
  address: string;
  profile: ProfileData | null;
  index: number;
  variant?: 'default' | 'super' | 'liked' | 'outgoing' | 'incoming';
  actionButtons?: React.ReactNode;
  badge?: React.ReactNode;
  statusLabel?: string;
  className?: string;
    chat?: boolean; // New prop to indicate if this is for chat
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  address,
  profile,
  index,
  variant = 'default',
  actionButtons,
  badge,
  statusLabel,
  className = '',
  chat= false // New prop to indicate if this is for chat
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'super':
        return 'border-2 border-red-500/30 hover:border-red-400/50 bg-gradient-to-b from-red-500/5';
      case 'liked':
        return 'border border-blue-500/20 hover:border-blue-400/40';
      case 'outgoing':
        return 'border border-green-500/20 hover:border-green-400/40';
      case 'incoming':
        return 'border-2 border-yellow-500/30 hover:border-yellow-400/50 bg-gradient-to-b from-yellow-500/5';
      default:
        return 'border border-purple-500/20 hover:border-purple-400/40';
    }
  };

  const getStatusLabelColor = () => {
    switch (variant) {
      case 'super':
        return 'text-red-300';
      case 'liked':
        return 'text-blue-300';
      case 'outgoing':
        return 'text-green-300';
      case 'incoming':
        return 'text-yellow-300';
      default:
        return 'text-purple-300';
    }
  };

  const getStatusDot = () => {
    switch (variant) {
      case 'super':
        return 'from-red-500 to-pink-500';
      case 'liked':
        return 'from-blue-500 to-cyan-500';
      case 'outgoing':
        return 'from-green-500 to-teal-500';
      case 'incoming':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div
      className={`glass relative rounded-xl transition-all duration-300 group overflow-hidden ${getVariantStyles()} ${className}`}
    >
      <div className="aspect-[3/4] relative">
        <ImageCarousel
          images={profile?.uri || []}
          alt={profile?.name || "Profile"}
          className="w-full h-full object-cover rounded-t-xl"
        />
        
        {/* Badge (like Super badge, Status badge, etc.) */}
        {badge && (
          <div className="absolute top-2 right-2">
            {badge}
          </div>
        )}
        
        {/* Action Buttons (hover overlay) */}
        {actionButtons && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {actionButtons}
          </div>
        )}

        {/* Profile Info Overlay */}
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-t from-black/80 to-transparent p-4">
          {statusLabel && (
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 bg-gradient-to-br ${getStatusDot()} rounded-full`}></div>
              <span className={`text-xs ${getStatusLabelColor()}`}>{statusLabel}</span>
            </div>
          )}
          <h4 className="text-white font-semibold text-lg">
            {profile?.name || `User #${index + 1}`}
          </h4>
          <p className="text-gray-300 text-sm">
            {profile?.age ? `${profile.age} years` : ""}
          </p>
          <p className="text-gray-300 text-xs font-mono mt-1">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      {chat && <div className='absolute bottom-0 mb-4 left-1/2  text-2xl flex items-center justify-center rounded-full h-10 w-10 -translate-x-1/2 bg-yellow-500 hover:bg-yellow-400' >💬</div>}
      </div>
    </div>
  );
};

export default ProfileCard;
