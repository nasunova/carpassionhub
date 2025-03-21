import React, { useState, useEffect } from 'react';
import { BlurredCard } from '@/components/ui/BlurredCard';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [registrationError, setRegistrationError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [forceReady, setForceReady] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  
  // Track component renders to help diagnose issues
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.info(`Auth page rendered ${renderCount + 1} times`);
  }, []);
  
  // Force the page to become interactive after a timeout
  useEffect(() => {
    console.info("Auth page - setting up timeout to force ready state");
    const timeout = setTimeout(() => {
      console.info("Auth page - forcing ready state after timeout");
      setForceReady(true);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Redirect if already logged in - with a short delay to ensure context is ready
  useEffect(() => {
    console.info("Auth page - checking user state:", { 
      user: user ? user.id : null, 
      loading, 
      forceReady,
      route: window.location.pathname
    });
    
    // Short delay to ensure navigation happens after state is updated
    const redirectTimeout = setTimeout(() => {
      if (user && !loading) {
        console.info("User is logged in, redirecting to garage");
        navigate('/garage');
      }
    }, 500);
    
    return () => clearTimeout(redirectTimeout);
  }, [user, loading, navigate, forceReady]);
  
  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id === 'login-email' ? 'email' : 'password']: value
    }));
    setLoginError('');
  };
  
  // Handle register form changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [id === 'name' ? 'name' : 
        id === 'register-email' ? 'email' : 
        id === 'register-password' ? 'password' : 'confirmPassword']: value
    }));
    
    if (id === 'register-password' || id === 'confirm-password') {
      const pwd = id === 'register-password' ? value : registerData.password;
      const confirmPwd = id === 'confirm-password' ? value : registerData.confirmPassword;
      setPasswordsMatch(pwd === confirmPwd || confirmPwd === '');
    }
    
    setRegistrationError('');
  };
  
  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      console.info("Attempting login with email:", loginData.email);
      await signIn(loginData.email, loginData.password);
      // Navigate is handled in AuthContext
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || 'Errore durante l\'accesso. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Validation functions
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'La password deve contenere almeno 6 caratteri.';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'L\'indirizzo email non è valido.';
    }
    return '';
  };
  
  // Handle register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Reset errors
    setRegistrationError('');
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setPasswordsMatch(false);
      setRegistrationError('Le password non coincidono.');
      return;
    }
    
    // Validate password length
    const passwordError = validatePassword(registerData.password);
    if (passwordError) {
      setRegistrationError(passwordError);
      return;
    }
    
    // Validate email format
    const emailError = validateEmail(registerData.email);
    if (emailError) {
      setRegistrationError(emailError);
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.info("Attempting registration with email:", registerData.email);
      await signUp(registerData.email, registerData.password, registerData.name);
      // AuthContext handles navigation after successful signup
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message || 'Errore durante la registrazione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle page refresh
  const handleRefresh = () => {
    console.info("User requested page refresh");
    window.location.reload();
  };
  
  // Show loading state if still initializing
  if ((loading && !forceReady) || (!user && !forceReady && loading)) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-racing-red" />
          <p className="mt-4 text-muted-foreground">Verifica autenticazione in corso...</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleRefresh}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Ricarica pagina
          </Button>
        </div>
      </div>
    );
  }
  
  // Show a ready message if debugging
  console.info("Auth page ready to render form content");
  
  return (
    <AnimatedTransition>
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
        <BlurredCard className="w-full max-w-md p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-center mb-6">Benvenuto su CarPassionHub</h1>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="register">Registrati</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="la-tua@email.com" 
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Accesso in corso...
                      </>
                    ) : 'Accedi'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {registrationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registrationError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Mario Rossi" 
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="la-tua@email.com" 
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required 
                    />
                    <p className="text-xs text-muted-foreground">
                      La password deve contenere almeno 6 caratteri.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={!passwordsMatch ? "text-red-500" : ""}>
                      Conferma Password
                    </Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className={!passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}
                      required 
                    />
                    {!passwordsMatch && (
                      <p className="text-red-500 text-sm mt-1">Le password non coincidono</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !passwordsMatch}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creazione account...
                      </>
                    ) : 'Crea Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Continuando, accetti i nostri Termini di Servizio e la Privacy Policy.</p>
            </div>
          </motion.div>
        </BlurredCard>
      </div>
    </AnimatedTransition>
  );
};

export default Auth;
