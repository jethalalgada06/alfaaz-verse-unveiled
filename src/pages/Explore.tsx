
import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [poems, setPoems] = useState<Poem[]>([]);
  const [featuredPoets, setFeaturedPoets] = useState<FeaturedPoet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const getPoetInitials = (poet: FeaturedPoet) => {
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
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Explore</h2>
          <p className="text-muted-foreground">Discover new voices and styles</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search poems, poets, or styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-background border-border focus:border-primary text-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className={`${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Following Users Section */}
        {featuredPoets.length > 0 && (
          <div className="mb-8 p-6 bg-card rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-serif font-semibold text-card-foreground mb-4">People You Follow</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredPoets.map((poet) => (
                <div key={poet.id} className="text-center p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center border border-border">
                    <span className="text-foreground font-semibold">{getPoetInitials(poet)}</span>
                  </div>
                  <p className="font-medium text-card-foreground">{poet["full name"] || poet.username}</p>
                  <p className="text-xs text-muted-foreground">Poet</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for following */}
        {featuredPoets.length === 0 && !loading && (
          <div className="mb-8 p-6 bg-card rounded-lg shadow-sm border border-border text-center">
            <h3 className="text-xl font-serif font-semibold text-card-foreground mb-2">No Following Yet</h3>
            <p className="text-muted-foreground">Start following poets to see them here!</p>
          </div>
        )}

        {/* Poems */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-muted rounded"></div>
                    <div className="w-16 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-48 h-6 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted rounded"></div>
                    <div className="w-3/4 h-4 bg-muted rounded"></div>
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
            <h3 className="text-xl font-serif text-foreground mb-2">No poems found</h3>
            <p className="text-muted-foreground">Try a different filter or be the first to create content!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
