
import React from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { MapView } from '@/components/MapView';

const Roads = () => {
  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Scenic Driving Roads</h1>
        
        <div className="mb-8">
          <BlurredCard className="p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Discover the Best Driving Roads</h2>
            <p className="text-muted-foreground mb-4">
              Explore our curated collection of the most thrilling and scenic driving roads, 
              rated and reviewed by fellow car enthusiasts. Find your next driving adventure!
            </p>
          </BlurredCard>
          
          <div className="h-[500px] w-full mb-8 rounded-xl overflow-hidden">
            <MapView />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Road cards will be dynamically loaded here */}
          <p className="col-span-full text-center text-muted-foreground">
            Road recommendations coming soon. Be the first to add your favorite driving road!
          </p>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Roads;
