
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../hooks/useAuth';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Settings } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const response = await api.get('/api/settings');
      return response.data;
    },
    placeholderData: {
      appName: 'noAssets',
      companyName: 'Your Company'
    }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const { formState } = form;
  const { isSubmitting } = formState;
  
  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login form error:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center text-blue-600">{settings?.appName || 'noAssets'}</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
              className="ml-2"
              title="Configure API Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Demo credentials: admin@example.com / password123
          </p>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => navigate('/settings')}
            className="text-blue-600"
          >
            Configure API
          </Button>
        </CardFooter>
      </Card>
      
      <footer className="w-full mt-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {settings?.companyName || 'Your Company'}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
