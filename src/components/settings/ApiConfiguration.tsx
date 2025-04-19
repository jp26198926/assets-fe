
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ApiConfigFormValues {
  apiUrl: string;
}

const ApiConfiguration = () => {
  const { toast } = useToast();
  const [defaultApiUrl, setDefaultApiUrl] = React.useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<ApiConfigFormValues>({
    defaultValues: {
      apiUrl: localStorage.getItem('api_base_url') || import.meta.env.VITE_API_URL || 'http://localhost:3000',
    }
  });
  
  React.useEffect(() => {
    setDefaultApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  }, []);

  const onSubmit = (data: ApiConfigFormValues) => {
    try {
      localStorage.setItem('api_base_url', data.apiUrl);
      api.defaults.baseURL = data.apiUrl;
      
      toast({
        title: "Settings saved",
        description: "API URL has been updated successfully.",
      });
      
      // If not logged in, redirect to login page after API URL is set
      if (!user) {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };
  
  const resetToDefault = () => {
    form.setValue('apiUrl', defaultApiUrl);
    
    if (defaultApiUrl) {
      localStorage.setItem('api_base_url', defaultApiUrl);
      api.defaults.baseURL = defaultApiUrl;
      
      toast({
        title: "Settings reset",
        description: "API URL has been reset to default.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          {!user 
            ? "Configure the server URL before logging in"
            : "Configure the connection to your backend server"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Server URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://localhost:3000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
              <Button type="button" variant="outline" onClick={resetToDefault} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
              {!user && (
                <Button type="button" variant="secondary" onClick={() => navigate('/login')} className="ml-auto">
                  Go to Login
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-slate-500">
        <p>Changes to the API URL will take effect immediately. Make sure the URL is accessible.</p>
      </CardFooter>
    </Card>
  );
};

export default ApiConfiguration;
