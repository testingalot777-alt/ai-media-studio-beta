
import React from 'react';

interface FunctionCardProps {
  icon: JSX.Element;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ icon, name, isActive, onClick }) => {
  const baseClasses = "flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-200 aspect-square";
  const activeClasses = "bg-indigo-600 text-white shadow-lg scale-105";
  const inactiveClasses = "bg-gray-700 hover:bg-gray-600 text-gray-300";

  return (
    <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} onClick={onClick}>
      <div className="function-card-icon">{icon}</div>
      <div className="function-card-name mt-2 text-sm text-center font-medium">{name}</div>
    </div>
  );
};

export default FunctionCard;
