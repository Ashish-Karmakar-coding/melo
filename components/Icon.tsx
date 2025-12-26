
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  // Added fill support for icons that need internal coloring
  fill?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', fill, onClick }) => {
  const LucideIcon = LucideIcons[name] as React.FC<any>;
  if (!LucideIcon) return null;
  // Pass the fill prop down to the underlying Lucide component along with other props
  return <LucideIcon size={size} className={className} fill={fill} onClick={onClick} />;
};
