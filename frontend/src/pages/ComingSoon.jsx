import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const PAGE_INFO = {
  '/crop-guide':    { icon: '📖', title: 'Crop Guide',     desc: 'Get expert guidance on growing different crops, best practices, soil requirements, and seasonal tips.' },
  '/mandi-prices':  { icon: '💰', title: 'Mandi Prices',   desc: 'Live market prices for your crops from mandis across the country, updated daily.' },
  '/weather':       { icon: '⛅', title: 'Weather',         desc: 'Hyperlocal weather forecasts tailored for farmers — rain, humidity, wind speed and more.' },
  '/crop-doctor':   { icon: '🩺', title: 'Crop Doctor',    desc: 'AI-powered crop disease detection. Upload a photo of your crop and get instant diagnosis.' },
  '/create-problem':{ icon: '📝', title: 'Post a Problem', desc: 'Post your farming problems and get solutions from experts and fellow farmers in the community.' },
};

export default function ComingSoon() {
  const location = useLocation();
  const info = PAGE_INFO[location.pathname] || { icon: '🚧', title: 'Coming Soon', desc: 'This feature is under development and will be available soon.' };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
      <Card hoverEffect={false} className="max-w-lg w-full mx-auto text-center p-12 border-dashed border-2 bg-brand-primary/5 dark:bg-card-dark">
        <span className="text-7xl mb-6 inline-block">{info.icon}</span>
        <div className="inline-block mb-4 px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-bold rounded-full uppercase tracking-wider">
          Coming Soon
        </div>
        <h1 className="text-3xl font-heading font-bold text-text-main dark:text-text-inverse mb-4">
          {info.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          {info.desc}
        </p>
        <Link to="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
