
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';
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

const Home = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPoems();
    }
  }, [user]);

  const fetchPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems table')
        .select(`
          *,
          users (
            id,
            username,
            "full name",
            profile_image_url
          )
        `)
        .order('created_at', { ascending: false });

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Your Feed</h2>
          <p className="text-muted-foreground">Discover beautiful poetry from our community</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
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
                    <div className="w-5/6 h-4 bg-muted rounded"></div>
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
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-serif text-foreground mb-2">No poems yet</h3>
            <p className="text-muted-foreground">Be the first to share a poem with the community!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
