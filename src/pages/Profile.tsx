import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string;
  "full name": string | null;
  bio: string | null;
  writing_style_tags: string | null;
  profile_image_url: string | null;
}

interface Poem {
  id: string;
  content: string;
  form_tags: string | null;
  created_at: string;
}

interface UserStats {
  followers_count: number;
  following_count: number;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('poems');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ followers_count: 0, following_count: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    bio: '',
    writing_style_tags: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserPoems();
      fetchUserStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setEditForm({
        username: data.username || '',
        full_name: data['full name'] || '',
        bio: data.bio || '',
        writing_style_tags: data.writing_style_tags || ''
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems table')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching poems:', error);
        return;
      }

      setUserPoems(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get followers count
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select('*')
        .eq('following_id', user?.id);

      // Get following count
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('*')
        .eq('followers_id', user?.id);

      if (followersError || followingError) {
        console.error('Error fetching user stats:', followersError || followingError);
        return;
      }

      setUserStats({
        followers_count: followersData?.length || 0,
        following_count: followingData?.length || 0
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: editForm.username,
          'full name': editForm.full_name,
          bio: editForm.bio,
          writing_style_tags: editForm.writing_style_tags
        })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getUserInitials = () => {
    if (profile?.['full name']) {
      return profile['full name']
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return profile?.username?.charAt(0).toUpperCase() || 'U';
  };

  const getWritingStyleTags = () => {
    if (!profile?.writing_style_tags) return [];
    return profile.writing_style_tags.split(',').map(tag => tag.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <Card className="glass-card border-border shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.profile_image_url || ''} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="bg-background border-border text-foreground"
                    />
                    <Input
                      placeholder="Username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="bg-background border-border text-foreground"
                    />
                    <Textarea
                      placeholder="Bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="bg-background border-border text-foreground"
                    />
                    <Input
                      placeholder="Writing styles (comma separated)"
                      value={editForm.writing_style_tags}
                      onChange={(e) => setEditForm({...editForm, writing_style_tags: e.target.value})}
                      className="bg-background border-border text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2">
                      {profile?.['full name'] || profile?.username || 'User'}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                      {profile?.bio || 'No bio available. Click "Edit Profile" to add one.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getWritingStyleTags().map((tag) => (
                        <span key={tag} className="text-xs bg-muted text-foreground px-3 py-1 rounded-full border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-card-foreground">{userPoems.length}</div>
                        <div className="text-muted-foreground">Poems</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-card-foreground">{userStats.followers_count}</div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-card-foreground">{userStats.following_count}</div>
                        <div className="text-muted-foreground">Following</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-card-foreground">0</div>
                        <div className="text-muted-foreground">Likes</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'poems' && (
            <div className="space-y-6">
              {userPoems.length > 0 ? (
                userPoems.map((poem) => (
                  <Card key={poem.id} className="glass-card border-border shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={profile?.profile_image_url || ''} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-card-foreground">{profile?.['full name'] || profile?.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(poem.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {poem.form_tags && (
                          <span className="ml-auto text-xs bg-muted text-foreground px-2 py-1 rounded-full border border-border">
                            {poem.form_tags}
                          </span>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-card-foreground">
                        {poem.content}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📝</span>
                  <h3 className="text-xl font-serif text-foreground mb-2">No poems yet</h3>
                  <p className="text-muted-foreground">Start creating to see your poems here</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'bookmarks' && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔖</span>
              <h3 className="text-xl font-serif text-foreground mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground">Poems you bookmark will appear here</p>
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">❤️</span>
              <h3 className="text-xl font-serif text-foreground mb-2">No liked poems yet</h3>
              <p className="text-muted-foreground">Poems you like will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
