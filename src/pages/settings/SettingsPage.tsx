
import React from 'react';
import ApiConfiguration from '@/components/settings/ApiConfiguration';
import AppSettings from '@/components/settings/AppSettings';
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600">Configure application settings</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* API Configuration is available to all users, even without login */}
        <ApiConfiguration />
        
        {/* App Settings only visible to Admins */}
        {user && user.role === 'Admin' && (
          <>
            <Separator className="my-8" />
            <AppSettings />
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
