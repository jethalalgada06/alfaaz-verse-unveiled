
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent select_account',
          }
        }
      });

      if (error) {
        console.error('Google auth error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`
          }
        });

        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in",
          });
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Email auth error:', error);
      toast({
        title: "Authentication Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md animate-scale-in">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Alfaaz</h1>
          <p className="text-sm sm:text-base text-gray-600">Where words come alive</p>
        </div>

        <Card className="bg-white border border-gray-200 shadow-2xl">
          <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-serif text-black">
              {isSignUp ? 'Join Alfaaz' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              {isSignUp 
                ? 'Join the community of poets and storytellers' 
                : 'Continue your poetic journey'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 text-base bg-gray-50 border-gray-200"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 sm:h-12 text-base bg-gray-50 border-gray-200"
              />
              <Button
                onClick={handleEmailAuth}
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-800 text-white h-11 sm:h-12 text-sm sm:text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm">
                      {isSignUp ? 'Creating account...' : 'Signing in...'}
                    </span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-600">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              variant="outline"
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium border-gray-200 hover:bg-gray-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="hidden xs:inline">Continue with Google</span>
                  <span className="xs:hidden">Google</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs sm:text-sm text-black hover:text-gray-600 underline"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            <div className="text-center pt-3 sm:pt-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                By continuing, you agree to our terms of service and privacy policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
