import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  onClick,
}) => {
  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#1A66FF]/30 transition-all duration-300 hover:-translate-y-1 ${onClick ? "cursor-pointer" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-[#1A66FF] to-[#77C624] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1A66FF] transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Subtle hover decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A66FF]/5 to-[#77C624]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default FeatureCard;
