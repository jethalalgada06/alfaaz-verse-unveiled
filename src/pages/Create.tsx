
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Create = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please add a title and content for your poem",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);
    
    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        title: "Poem published!",
        description: "Your poem has been shared with the community",
      });
      navigate('/home');
    }, 1500);
  };

  const formatContent = (text: string) => {
    // Simple auto-formatting for better line breaks
    return text.replace(/\n{3,}/g, '\n\n');
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-primary mb-2">Create New Poem</h2>
          <p className="text-secondary/70">Share your words with the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary">Compose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your poem title..."
                  className="bg-white border-gray-200 focus:border-accent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Style
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select poetry style" />
                  </SelectTrigger>
                  <SelectContent>
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
                  rows={12}
                  className="bg-white border-gray-200 focus:border-accent font-serif resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="bg-accent hover:bg-accent/90 text-white px-6"
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
                <Button variant="outline" className="border-gray-200">
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold">P</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Poet Name</p>
                    <p className="text-sm text-secondary/60">Just now</p>
                  </div>
                  {style && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full ml-auto">
                      {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                    {title || 'Untitled Poem'}
                  </h3>
                  <div className="poetry-text text-secondary/90 leading-relaxed whitespace-pre-line min-h-[200px]">
                    {content || 'Your poem will appear here as you type...'}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <span className="text-secondary/60 text-sm">🤍 0</span>
                  <span className="text-secondary/60 text-sm">💬 0</span>
                  <span className="text-secondary/60 text-sm ml-auto">📄</span>
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
