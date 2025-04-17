
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface SettingsFormValues {
  apiUrl: string;
}

const SettingsPage = () => {
  const { toast } = useToast();
  const [defaultApiUrl, setDefaultApiUrl] = useState("");
  
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      apiUrl: localStorage.getItem('api_base_url') || import.meta.env.VITE_API_URL || 'http://localhost:3000',
    }
  });
  
  useEffect(() => {
    // Store the default API URL from the environment
    setDefaultApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  }, []);

  const onSubmit = (data: SettingsFormValues) => {
    try {
      // Save API URL to localStorage
      localStorage.setItem('api_base_url', data.apiUrl);
      
      // Update axios instance base URL
      api.defaults.baseURL = data.apiUrl;
      
      toast({
        title: "Settings saved",
        description: "API URL has been updated successfully.",
      });
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
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600">Configure application settings</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure the connection to your backend server</CardDescription>
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
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-sm text-slate-500">
            <p>Changes to the API URL will take effect immediately. Make sure the URL is accessible.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
