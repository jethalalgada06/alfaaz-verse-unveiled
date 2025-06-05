
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface PoemCardProps {
  poem: {
    id: string;
    title: string;
    content: string;
    author: string;
    avatar?: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
    timestamp: string;
    style?: string;
  };
}

const PoemCard = ({ poem }: PoemCardProps) => {
  const [isLiked, setIsLiked] = useState(poem.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(poem.isBookmarked);
  const [likes, setLikes] = useState(poem.likes);
  const [showFullPoem, setShowFullPoem] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    toast({
      description: isLiked ? "Removed from likes" : "Added to likes",
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      description: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    });
  };

  const truncatedContent = poem.content.length > 200 
    ? poem.content.substring(0, 200) + '...' 
    : poem.content;

  return (
    <Card className="hover-lift glass-card border-0 shadow-lg mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={poem.avatar} />
            <AvatarFallback className="bg-accent text-white">
              {poem.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium text-primary">{poem.author}</h4>
            <p className="text-sm text-secondary/60">{poem.timestamp}</p>
          </div>
          {poem.style && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
              {poem.style}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <h3 className="text-xl font-serif font-semibold text-primary mb-3">
          {poem.title}
        </h3>
        <div className="poetry-text text-secondary/90 leading-relaxed whitespace-pre-line">
          {showFullPoem ? poem.content : truncatedContent}
        </div>
        
        {poem.content.length > 200 && (
          <Button
            variant="ghost"
            onClick={() => setShowFullPoem(!showFullPoem)}
            className="text-accent hover:text-accent/80 p-0 h-auto mt-2"
          >
            {showFullPoem ? 'Show less' : 'Read more'}
          </Button>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-2 h-auto ${isLiked ? 'text-red-500' : 'text-secondary/60'} hover:text-red-500`}
            >
              <span className="text-lg mr-1">{isLiked ? '❤️' : '🤍'}</span>
              <span className="text-sm">{likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary/60 hover:text-accent p-2 h-auto"
            >
              <span className="text-lg mr-1">💬</span>
              <span className="text-sm">{poem.comments}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`p-2 h-auto ${isBookmarked ? 'text-accent' : 'text-secondary/60'} hover:text-accent`}
          >
            <span className="text-lg">{isBookmarked ? '🔖' : '📄'}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PoemCard;
