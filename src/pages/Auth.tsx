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
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  // Auth context
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Login and register form data
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
  
  // Form states
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [registrationError, setRegistrationError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forced loading state with a timeout to prevent infinite loading
  const [pageReady, setPageReady] = useState(false);
  
  // Fix: Initialize page and prevent getting stuck
  useEffect(() => {
    console.log("Auth page loading - initial state check");
    
    // Force page ready after a short delay regardless of auth state
    const forceReadyTimer = setTimeout(() => {
      console.log("Auth page - forcing ready state after timeout");
      setPageReady(true);
    }, 1000);
    
    return () => {
      clearTimeout(forceReadyTimer);
    };
  }, []);
  
  // Handle navigation when user state changes
  useEffect(() => {
    if (user && pageReady) {
      console.log("Auth page - user detected, navigating to garage");
      navigate('/garage', { replace: true });
    }
  }, [user, pageReady, navigate]);
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id === 'login-email' ? 'email' : 'password']: value
    }));
    setLoginError('');
  };
  
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
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLogin) return;
    
    setIsSubmittingLogin(true);
    setLoginError('');
    
    try {
      console.log("Attempting login with:", loginData.email);
      await signIn(loginData.email, loginData.password);
      
      // Show success toast
      toast({
        title: "Login effettuato",
        description: "Accesso effettuato con successo. Redirezione in corso...",
      });
      
      // Force navigation after a short delay
      setTimeout(() => {
        navigate('/garage', { replace: true });
      }, 500);
      
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || 'Errore durante l\'accesso. Riprova più tardi.');
      setIsSubmittingLogin(false);
    }
  };
  
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
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRegister) return;
    
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
    
    setIsSubmittingRegister(true);
    try {
      console.log("Attempting registration with:", registerData.email);
      await signUp(registerData.email, registerData.password, registerData.name);
      
      // Show success toast
      toast({
        title: "Registrazione completata",
        description: "Account creato con successo. Redirezione in corso...",
      });
      
      // Force navigation after a short delay
      setTimeout(() => {
        navigate('/garage', { replace: true });
      }, 500);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message || 'Errore durante la registrazione. Riprova più tardi.');
      setIsSubmittingRegister(false);
    }
  };
  
  // Show loading state
  if (!pageReady || (authLoading && !user)) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-racing-red" />
          <p className="mt-4 text-muted-foreground">Caricamento in corso...</p>
        </div>
      </div>
    );
  }
  
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
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmittingLogin}>
                    {isSubmittingLogin ? (
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
                    <div className="relative">
                      <Input 
                        id="register-password" 
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      La password deve contenere almeno 6 caratteri.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={!passwordsMatch ? "text-red-500" : ""}>
                      Conferma Password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className={!passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}
                        required 
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {!passwordsMatch && (
                      <p className="text-red-500 text-sm mt-1">Le password non coincidono</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmittingRegister || !passwordsMatch}
                  >
                    {isSubmittingRegister ? (
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
