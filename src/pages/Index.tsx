
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApiDocsContent from '@/components/ApiDocsContent';
import AuthDocsContent from '@/components/AuthDocsContent';
import ModelsDocsContent from '@/components/ModelsDocsContent';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Asset Nexus API</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A RESTful API for asset management with MongoDB and JWT authentication
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg>
                  MongoDB Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-700">Full MongoDB integration with Mongoose schemas for data validation and relationships.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  JWT Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-700">Secure authentication with JSON Web Tokens and role-based access control.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M18 16.98h-6l-2 2H6" /><path d="M2 12.98c0-2.2 1.8-4 4-4h12" /><path d="M22 15h-3" /><path d="M16 11.01 14 9" /><path d="m16 6.95-2 2.06" /><path d="M14 18.01 12 20" /><path d="M22 20h-3" /><circle cx="18" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="9" cy="18" r="3" /><path d="M10 6h8" /></svg>
                  RESTful Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-700">Complete CRUD API endpoints for users, items, rooms, assignments and repairs.</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="api">API Endpoints</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="models">Data Models</TabsTrigger>
            </TabsList>
            <TabsContent value="api" className="p-4 bg-white border rounded-md">
              <ApiDocsContent />
            </TabsContent>
            <TabsContent value="auth" className="p-4 bg-white border rounded-md">
              <AuthDocsContent />
            </TabsContent>
            <TabsContent value="models" className="p-4 bg-white border rounded-md">
              <ModelsDocsContent />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-slate-600">
            <p>Server implementation code available in the repository</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
