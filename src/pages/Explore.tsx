import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Poem {
  id: string;
  content: string;
  form_tags: string | null;
  created_at: string;
  user_id: string;
  users: {
    id: string;
    username: string;
    "full name": string | null;
    profile_image_url: string | null;
  };
}

interface FeaturedPoet {
  id: string;
  username: string;
  "full name": string | null;
  profile_image_url: string | null;
}

interface SearchUser {
  id: string;
  username: string;
  "full name": string | null;
  profile_image_url: string | null;
  bio: string | null;
  isFollowing?: boolean;
}

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [poems, setPoems] = useState<Poem[]>([]);
  const [featuredPoets, setFeaturedPoets] = useState<FeaturedPoet[]>([]);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const filters = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'recent', label: 'Recent', icon: '⏰' },
    { id: 'haiku', label: 'Haiku', icon: '🌸' },
    { id: 'sonnet', label: 'Sonnet', icon: '📜' },
    { id: 'free-verse', label: 'Free Verse', icon: '🌊' }
  ];

  useEffect(() => {
    if (user) {
      fetchPoems();
      fetchFollowingUsers();
    }
  }, [user, activeFilter]);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const fetchPoems = async () => {
    try {
      let query = supabase
        .from('poems table')
        .select(`
          *,
          users (
            id,
            username,
            "full name",
            profile_image_url
          )
        `);

      // Apply filters
      if (activeFilter === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (activeFilter === 'haiku') {
        query = query.ilike('form_tags', '%haiku%');
      } else if (activeFilter === 'sonnet') {
        query = query.ilike('form_tags', '%sonnet%');
      } else if (activeFilter === 'free-verse') {
        query = query.ilike('form_tags', '%free%');
      } else {
        // Default trending - order by created_at for now
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(10);

      if (error) {
        console.error('Error fetching poems:', error);
        return;
      }

      setPoems(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingUsers = async () => {
    try {
      // First get the list of users that the current user is following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('followers_id', user?.id);

      if (followingError) {
        console.error('Error fetching following list:', followingError);
        return;
      }

      const followingIds = followingData?.map(f => f.following_id) || [];

      if (followingIds.length === 0) {
        // If user is not following anyone, show empty state
        setFeaturedPoets([]);
        return;
      }

      // Then get the user details for those following users
      const { data, error } = await supabase
        .from('users')
        .select('id, username, "full name", profile_image_url')
        .in('id', followingIds)
        .limit(4);

      if (error) {
        console.error('Error fetching following users:', error);
        return;
      }

      setFeaturedPoets(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, "full name", profile_image_url, bio')
        .or(`username.ilike.%${searchTerm}%,"full name".ilike.%${searchTerm}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      // Check which users are already being followed
      const { data: followingData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('followers_id', user?.id)
        .in('following_id', data?.map(u => u.id) || []);

      const followingIds = followingData?.map(f => f.following_id) || [];

      const usersWithFollowStatus = data?.map(user => ({
        ...user,
        isFollowing: followingIds.includes(user.id)
      })) || [];

      setSearchResults(usersWithFollowStatus);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          followers_id: user?.id,
          following_id: targetUserId
        });

      if (error) {
        toast({
          title: "Error following user",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Update the search results to reflect the follow
      setSearchResults(prev => prev.map(u => 
        u.id === targetUserId ? { ...u, isFollowing: true } : u
      ));

      toast({
        title: "Success",
        description: "You are now following this user"
      });

      fetchFollowingUsers(); // Refresh the following list
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('followers_id', user?.id)
        .eq('following_id', targetUserId);

      if (error) {
        toast({
          title: "Error unfollowing user",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Update the search results to reflect the unfollow
      setSearchResults(prev => prev.map(u => 
        u.id === targetUserId ? { ...u, isFollowing: false } : u
      ));

      toast({
        title: "Success",
        description: "You are no longer following this user"
      });

      fetchFollowingUsers(); // Refresh the following list
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const formatPoemForCard = (poem: Poem) => {
    return {
      id: poem.id,
      title: poem.form_tags || 'Untitled',
      content: poem.content || '',
      author: poem.users?.["full name"] || poem.users?.username || 'Anonymous',
      avatar: poem.users?.profile_image_url,
      likes: 0, // We'll implement likes later
      comments: 0, // We'll implement comments later
      isLiked: false,
      isBookmarked: false,
      timestamp: new Date(poem.created_at).toLocaleDateString(),
      style: poem.form_tags
    };
  };

  const getPoetInitials = (poet: FeaturedPoet | SearchUser) => {
    if (poet["full name"]) {
      return poet["full name"]
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return poet.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-black mb-2">Explore</h2>
          <p className="text-gray-600">Discover new voices and styles</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search poets by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-white border-gray-300 focus:border-black text-black"
          />
        </div>

        {/* Search Results */}
        {searchTerm.trim() && (
          <div className="mb-8">
            {searchLoading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-serif font-semibold text-black mb-4">Search Results</h3>
                <div className="space-y-4">
                  {searchResults.map((searchUser) => (
                    <div key={searchUser.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={searchUser.profile_image_url || ''} />
                          <AvatarFallback className="bg-black text-white">
                            {getPoetInitials(searchUser)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-black">{searchUser["full name"] || searchUser.username}</p>
                          <p className="text-sm text-gray-600">@{searchUser.username}</p>
                          {searchUser.bio && (
                            <p className="text-sm text-gray-500 mt-1">{searchUser.bio}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={searchUser.isFollowing ? "outline" : "default"}
                        onClick={() => searchUser.isFollowing ? handleUnfollow(searchUser.id) : handleFollow(searchUser.id)}
                        className={searchUser.isFollowing ? "border-gray-300 text-black hover:bg-gray-50" : "bg-black text-white hover:bg-gray-800"}
                      >
                        {searchUser.isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600">No users found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`${
                activeFilter === filter.id
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 text-black hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Following Users Section */}
        {featuredPoets.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-serif font-semibold text-black mb-4">People You Follow</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredPoets.map((poet) => (
                <div key={poet.id} className="text-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center border border-gray-200">
                    <span className="text-black font-semibold">{getPoetInitials(poet)}</span>
                  </div>
                  <p className="font-medium text-black">{poet["full name"] || poet.username}</p>
                  <p className="text-xs text-gray-600">Poet</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for following */}
        {featuredPoets.length === 0 && !loading && !searchTerm.trim() && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="text-xl font-serif font-semibold text-black mb-2">No Following Yet</h3>
            <p className="text-gray-600">Start following poets to see them here!</p>
          </div>
        )}

        {/* Poems */}
        {!searchTerm.trim() && (
          <>
            {loading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-48 h-6 bg-gray-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : poems.length > 0 ? (
              <div className="space-y-6">
                {poems.map((poem) => (
                  <div key={poem.id} className="animate-fade-in">
                    <PoemCard poem={formatPoemForCard(poem)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-serif text-black mb-2">No poems found</h3>
                <p className="text-gray-600">Try a different filter or be the first to create content!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Explore;
