
export type UserProfileData = {
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

export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  images: string[];
  specs: {
    power: string;
    engine: string;
    transmission: string;
    drivetrain: string;
  };
};

export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status: string;
};

export type Road = {
  id: number;
  name: string;
  location: string;
  rating: number;
  image: string;
  review: string;
};

// This is our internal representation of a user profile which combines
// Supabase auth data with profile data
export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
};
