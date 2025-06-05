
import Navigation from '@/components/Navigation';
import PoemCard from '@/components/PoemCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('poems');

  const userPoems = [
    {
      id: 'user1',
      title: 'Midnight Reflections',
      content: `In the quiet hours when the world sleeps,
I find myself in conversation with the stars.
They tell me stories of distant worlds,
Where words have wings and dreams take flight.

Each thought a constellation,
Each feeling a cosmic dance,
In this infinite space of possibility
Where my heart learns to believe again.`,
      author: 'Poet Name',
      likes: 89,
      comments: 12,
      isLiked: false,
      isBookmarked: false,
      timestamp: '2 days ago',
      style: 'Free Verse'
    }
  ];

  const stats = [
    { label: 'Poems', value: '23' },
    { label: 'Followers', value: '156' },
    { label: 'Following', value: '89' },
    { label: 'Likes', value: '1.2K' }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        {/* Profile Header */}
        <Card className="glass-card border-0 shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="bg-accent text-white text-2xl">P</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-serif font-bold text-primary mb-2">Poet Name</h1>
                <p className="text-secondary/70 mb-4">
                  Weaving words into worlds, one verse at a time. Poetry is the language of the soul, 
                  speaking truths that ordinary words cannot capture.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Free Verse', 'Narrative', 'Nature'].map((tag) => (
                    <span key={tag} className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6 text-sm">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="font-semibold text-primary">{stat.value}</div>
                      <div className="text-secondary/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-200">
                  Edit Profile
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {[
            { id: 'poems', label: 'Poems', icon: '📝' },
            { id: 'bookmarks', label: 'Bookmarks', icon: '🔖' },
            { id: 'likes', label: 'Liked', icon: '❤️' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-secondary hover:bg-muted'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'poems' && userPoems.map((poem) => (
            <div key={poem.id} className="animate-fade-in">
              <PoemCard poem={poem} />
            </div>
          ))}
          
          {activeTab === 'bookmarks' && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔖</span>
              <h3 className="text-xl font-serif text-primary mb-2">No bookmarks yet</h3>
              <p className="text-secondary/60">Poems you bookmark will appear here</p>
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">❤️</span>
              <h3 className="text-xl font-serif text-primary mb-2">No liked poems yet</h3>
              <p className="text-secondary/60">Poems you like will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
