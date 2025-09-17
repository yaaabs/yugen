import React from 'react';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  animate = true 
}) => {
  return (
    <div 
      className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
      aria-label="Loading content..."
    />
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Footer skeleton */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
};

export const ProjectListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const AdminStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;