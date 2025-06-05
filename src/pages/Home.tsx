
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';

const Home = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample poems data
  useEffect(() => {
    setTimeout(() => {
      setPoems([
        {
          id: '1',
          title: 'Whispers of Dawn',
          content: `The morning light breaks through the veil,
Of night's embrace so cold and pale.
With golden rays that dance and play,
Announcing birth of yet another day.

The birds sing songs of hope and cheer,
As dewdrops glisten crystal clear.
Each petal opens to the sun,
A new beginning has begun.`,
          author: 'Sarah Mitchell',
          likes: 127,
          comments: 23,
          isLiked: false,
          isBookmarked: false,
          timestamp: '2 hours ago',
          style: 'Lyrical'
        },
        {
          id: '2',
          title: 'City Dreams',
          content: `Concrete jungle, neon bright,
Dreams get lost in endless night.
Streets that whisper tales untold,
Of hearts both young and spirits old.

In coffee shops and subway cars,
We chase our distant shining stars.
Each face a story, each step a choice,
In symphony of urban voice.

The city breathes, the city sings,
Of broken hearts and golden rings.
Where love is found in strangest places,
Among the rush of nameless faces.`,
          author: 'Marcus Chen',
          likes: 89,
          comments: 15,
          isLiked: true,
          isBookmarked: true,
          timestamp: '4 hours ago',
          style: 'Free Verse'
        },
        {
          id: '3',
          title: 'Ocean\'s Soliloquy',
          content: `I am the keeper of secrets deep,
Where ancient treasures lie asleep.
My waves caress the moonlit shore,
And tell of love and tales of lore.

In depths where sunlight cannot reach,
I hold the wisdom few can teach.
Each tide that comes and goes away,
Marks passage of another day.`,
          author: 'Elena Rodriguez',
          likes: 156,
          comments: 31,
          isLiked: false,
          isBookmarked: false,
          timestamp: '6 hours ago',
          style: 'Nature'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-primary mb-2">Your Feed</h2>
          <p className="text-secondary/70">Discover beautiful poetry from our community</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
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
                    <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {poems.map((poem) => (
              <div key={poem.id} className="animate-fade-in">
                <PoemCard poem={poem} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
