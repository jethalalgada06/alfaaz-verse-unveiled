
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';
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

const Home = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPoems();
    }
  }, [user]);

  const fetchPoems = async () => {
    try {
      setLoading(true);
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
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching poems:', error);
        toast({
          title: "Error loading poems",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      setPoems(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      });
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
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      timestamp: new Date(poem.created_at).toLocaleDateString(),
      style: poem.form_tags
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Navigation />
        <main className="max-w-4xl mx-auto p-3 sm:p-4 pt-6 sm:pt-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-2">Your Feed</h2>
            <p className="text-sm sm:text-base text-gray-600">Discover beautiful poetry from our community</p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="w-12 sm:w-16 h-2 sm:h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-32 sm:w-48 h-5 sm:h-6 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="w-full h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="w-5/6 h-3 sm:h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-3 sm:p-4 pt-6 sm:pt-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-2">Your Feed</h2>
          <p className="text-sm sm:text-base text-gray-600">Discover beautiful poetry from our community</p>
        </div>

        {poems.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {poems.map((poem) => (
              <div key={poem.id} className="animate-fade-in">
                <PoemCard poem={formatPoemForCard(poem)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <span className="text-4xl sm:text-6xl mb-4 block">📝</span>
            <h3 className="text-lg sm:text-xl font-serif text-black mb-2">No poems yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Be the first to share a poem with the community!</p>
            <button 
              onClick={() => window.location.href = '/create'}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Your First Poem
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
