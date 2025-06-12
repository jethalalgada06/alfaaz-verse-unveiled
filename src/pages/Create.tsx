
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Create = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please add a title and content for your poem",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to publish your poem",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      const { error } = await supabase
        .from('poems table')
        .insert({
          user_id: user.id,
          content: content.trim(),
          form_tags: style || null
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Poem published!",
        description: "Your poem has been shared with the community",
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setStyle('');
      
      navigate('/home');
    } catch (error) {
      console.error('Error publishing poem:', error);
      toast({
        title: "Error publishing poem",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const formatContent = (text: string) => {
    return text.replace(/\n{3,}/g, '\n\n');
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Poet';
  };

  return (
    <div className="min-h-screen bg-muted pb-20">
      <Navigation />
      
      <main className="max-w-6xl mx-auto p-3 sm:p-4 pt-6 sm:pt-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2">Create New Poem</h2>
          <p className="text-sm sm:text-base text-secondary/70">Share your words with the world</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Editor */}
          <Card className="glass-card border-0 shadow-lg order-1">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-serif text-primary">Compose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your poem title..."
                  className="bg-white border-gray-200 focus:border-accent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Style
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-white border-gray-200 text-sm sm:text-base">
                    <SelectValue placeholder="Select poetry style" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 z-50">
                    <SelectItem value="free-verse">Free Verse</SelectItem>
                    <SelectItem value="haiku">Haiku</SelectItem>
                    <SelectItem value="sonnet">Sonnet</SelectItem>
                    <SelectItem value="limerick">Limerick</SelectItem>
                    <SelectItem value="ballad">Ballad</SelectItem>
                    <SelectItem value="lyrical">Lyrical</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Content
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(formatContent(e.target.value))}
                  placeholder="Write your poem here..."
                  rows={8}
                  className="bg-white border-gray-200 focus:border-accent font-serif resize-none text-sm sm:text-base min-h-[200px] sm:min-h-[300px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !title.trim() || !content.trim()}
                  className="bg-accent hover:bg-accent/90 text-white px-4 sm:px-6 text-sm sm:text-base order-1 sm:order-1"
                >
                  {isPublishing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Publishing...
                    </div>
                  ) : (
                    'Publish Poem'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-200 text-sm sm:text-base order-2 sm:order-2"
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setStyle('');
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="glass-card border-0 shadow-lg order-2 xl:order-2">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-serif text-primary">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold text-sm sm:text-base">
                      {getUserName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm sm:text-base">{getUserName()}</p>
                    <p className="text-xs sm:text-sm text-secondary/60">Just now</p>
                  </div>
                  {style && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full flex-shrink-0">
                      {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-primary mb-3">
                    {title || 'Untitled Poem'}
                  </h3>
                  <div className="poetry-text text-secondary/90 leading-relaxed whitespace-pre-line min-h-[150px] sm:min-h-[200px] text-sm sm:text-base">
                    {content || 'Your poem will appear here as you type...'}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <span className="text-secondary/60 text-xs sm:text-sm">🤍 0</span>
                  <span className="text-secondary/60 text-xs sm:text-sm">💬 0</span>
                  <span className="text-secondary/60 text-xs sm:text-sm ml-auto">📄</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Create;
