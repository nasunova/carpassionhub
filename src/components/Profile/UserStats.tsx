
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserStatsProps = {
  userProfile: {
    name: string;
    username: string;
    avatar: string;
    joinDate: string;
    bio: string;
    location: string;
    badges: string[];
    stats: {
      followers: number;
      following: number;
      events: number;
      roads: number;
    };
  };
  onEditClick: () => void;
};

const UserStats = ({ userProfile, onEditClick }: UserStatsProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
      <Avatar className="w-24 h-24">
        <AvatarImage src={userProfile.avatar} alt="Profile" />
        <AvatarFallback className="text-2xl">{(userProfile.name || 'U').charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <h1 className="text-3xl font-bold">{userProfile.name}</h1>
          <div className="flex flex-wrap gap-1 justify-center md:justify-start">
            {userProfile.badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mt-1">@{userProfile.username} · {userProfile.location}</p>
        <p className="text-muted-foreground">Membro da {userProfile.joinDate}</p>
        
        <p className="mt-3">{userProfile.bio}</p>
        
        <div className="mt-4 flex justify-center md:justify-start gap-6">
          <div className="text-center">
            <p className="font-bold">{userProfile.stats.followers}</p>
            <p className="text-sm text-muted-foreground">Follower</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{userProfile.stats.following}</p>
            <p className="text-sm text-muted-foreground">Seguiti</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{userProfile.stats.events}</p>
            <p className="text-sm text-muted-foreground">Eventi</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{userProfile.stats.roads}</p>
            <p className="text-sm text-muted-foreground">Strade</p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEditClick}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Modifica Profilo
          </Button>
          <Button variant="outline" size="sm">Impostazioni</Button>
        </div>
      </div>
    </div>
  );
};

export default UserStats;

// Import statements for the Button and Edit icon
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
