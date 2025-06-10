
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
      fetchFeaturedPoets();
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

  const fetchFeaturedPoets = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, "full name", profile_image_url')
        .limit(4);

      if (error) {
        console.error('Error fetching featured poets:', error);
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
    <div className="min-h-screen bg-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-primary mb-2">Explore</h2>
          <p className="text-secondary/70">Discover new voices and styles</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search poems, poets, or styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-white border-gray-200 focus:border-accent"
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
                  ? 'bg-accent text-white border-accent'
                  : 'border-gray-200 text-secondary hover:bg-accent/10'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Featured Poets Section */}
        {featuredPoets.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-serif font-semibold text-primary mb-4">Featured Poets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredPoets.map((poet) => (
                <div key={poet.id} className="text-center p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-accent font-semibold">{getPoetInitials(poet)}</span>
                  </div>
                  <p className="font-medium text-secondary">{poet["full name"] || poet.username}</p>
                  <p className="text-xs text-secondary/60">Poet</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Poems */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
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
            <h3 className="text-xl font-serif text-primary mb-2">No poems found</h3>
            <p className="text-secondary/60">Try a different filter or be the first to create content!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
