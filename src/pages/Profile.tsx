
import React from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-8">
        <BlurredCard className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="text-2xl">CP</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">Car Enthusiast</h1>
              <p className="text-muted-foreground mt-1">Member since 2023</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <Button variant="outline" size="sm">Edit Profile</Button>
                <Button variant="outline" size="sm">Settings</Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="garage" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="garage">My Garage</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="roads">Road Ratings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="garage" className="space-y-4">
              <div className="text-center p-8">
                <p className="text-muted-foreground">Your garage is empty. Add your first car!</p>
                <Button className="mt-4">Add a Car</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <div className="text-center p-8">
                <p className="text-muted-foreground">You haven't registered for any events yet.</p>
                <Button className="mt-4">Browse Events</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="roads" className="space-y-4">
              <div className="text-center p-8">
                <p className="text-muted-foreground">You haven't rated any roads yet.</p>
                <Button className="mt-4">Discover Roads</Button>
              </div>
            </TabsContent>
          </Tabs>
        </BlurredCard>
      </div>
    </AnimatedTransition>
  );
};

export default Profile;
