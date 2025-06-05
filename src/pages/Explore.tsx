
import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');

  const filters = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'recent', label: 'Recent', icon: '⏰' },
    { id: 'haiku', label: 'Haiku', icon: '🌸' },
    { id: 'sonnet', label: 'Sonnet', icon: '📜' },
    { id: 'free-verse', label: 'Free Verse', icon: '🌊' }
  ];

  const explorerPoems = [
    {
      id: '4',
      title: 'Digital Silence',
      content: `Notifications muted,
Screen reflects my weary face—
Peace in emptiness.`,
      author: 'Yuki Tanaka',
      likes: 203,
      comments: 41,
      isLiked: false,
      isBookmarked: false,
      timestamp: '1 hour ago',
      style: 'Haiku'
    },
    {
      id: '5',
      title: 'The Collector of Moments',
      content: `She keeps them in mason jars,
These fragments of time—
A laugh caught at sunset,
The smell of rain on summer stone,
Her grandmother's wrinkled hands
Kneading dough with ancient wisdom.

Each moment preserved
Like fireflies in glass,
Glowing softly in the dark
Of forgotten days.

When loneliness visits,
She opens a jar
And watches memory
Dance in the amber light
Of what was beautiful
And will be again.`,
      author: 'Isabella Voss',
      likes: 345,
      comments: 67,
      isLiked: true,
      isBookmarked: false,
      timestamp: '3 hours ago',
      style: 'Free Verse'
    }
  ];

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
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-serif font-semibold text-primary mb-4">Featured Poets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Maya Patel', 'James Wright', 'Zara Ahmed', 'Lucas Kim'].map((poet) => (
              <div key={poet} className="text-center p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-accent font-semibold">{poet.charAt(0)}</span>
                </div>
                <p className="font-medium text-secondary">{poet}</p>
                <p className="text-xs text-secondary/60">Poet</p>
              </div>
            ))}
          </div>
        </div>

        {/* Poems */}
        <div className="space-y-6">
          {explorerPoems.map((poem) => (
            <div key={poem.id} className="animate-fade-in">
              <PoemCard poem={poem} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
