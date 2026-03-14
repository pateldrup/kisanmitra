import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import { CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();
  const imageUrl = problem.image || 'https://images.unsplash.com/photo-1592982537447-6f2ecdd2fcc5?w=600&q=80';

  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={problem.cropType || 'Crop'}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-brand-primary/95 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-brand-primary/20">
            {problem.cropType || 'General'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-heading font-bold mb-2 line-clamp-2 text-text-main dark:text-text-inverse group-hover:text-brand-secondary dark:group-hover:text-brand-accent transition-colors">
          {problem.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {problem.description || 'No description provided for this problem.'}
        </p>

        <div className="mt-auto space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/60">
          <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-brand-secondary/80" />
              <span className="truncate">{problem.createdBy?.name || 'Local Farmer'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-brand-secondary/80" />
              <span className="truncate">{problem.createdBy?.location || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <CalendarIcon className="w-4 h-4 text-brand-secondary/80" />
              <span>{new Date(problem.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <Button
            className="w-full mt-2 !py-2 !text-sm"
            onClick={() => navigate(`/problem/${problem._id}`)}
          >
            View Details &amp; Solutions
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProblemCard;
