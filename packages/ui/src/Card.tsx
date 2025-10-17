import React from 'react';

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({
  title,
  description,
  imageUrl,
  footer,
  onClick,
  className = '',
}: CardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="aspect-video bg-gray-700">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
      {footer && <div className="px-4 pb-4 border-t border-gray-700 pt-2">{footer}</div>}
    </div>
  );
}
