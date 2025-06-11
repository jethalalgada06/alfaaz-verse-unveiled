
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { path: '/home', label: 'Feed', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🔍' },
    { path: '/create', label: 'Create', icon: '✍️' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation('/home')}
          >
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-black">Alfaaz</h1>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={activeTab === item.path ? "default" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-2 text-sm ${
                  activeTab === item.path 
                    ? 'bg-black text-white' 
                    : 'text-black hover:bg-muted'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <Avatar 
              className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:ring-2 hover:ring-black transition-all"
              onClick={handleSignOut}
              title="Click to sign out"
            >
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-black text-white text-xs sm:text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-border">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors min-w-0 flex-1 ${
                activeTab === item.path
                  ? 'text-black bg-muted'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="text-base mb-1">{item.icon}</span>
              <span className="text-xs truncate w-full text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
