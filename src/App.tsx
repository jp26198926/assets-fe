
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ItemsPage from "./pages/items/ItemsPage";
import ItemTypesPage from "./pages/itemTypes/ItemTypesPage";
import AreasPage from "./pages/areas/AreasPage";
import RepairsPage from "./pages/repairs/RepairsPage";
import ItemDetailsPage from "./pages/items/ItemDetailsPage";
import UsersPage from "./pages/users/UsersPage";
import TrailsPage from "./pages/trails/TrailsPage";
import IssuancePage from "./pages/issuance/IssuancePage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import { useState } from "react";

// Create a new component to handle QueryClient initialization correctly
const App = () => {
  // Create a new QueryClient inside the component to ensure React is initialized
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Settings Route */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Items Routes */}
              <Route path="/items" element={
                <ProtectedRoute>
                  <Layout>
                    <ItemsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/items/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ItemDetailsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Item Types Routes */}
              <Route path="/item-types" element={
                <ProtectedRoute>
                  <Layout>
                    <ItemTypesPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Areas Routes - updated from Rooms */}
              <Route path="/areas" element={
                <ProtectedRoute>
                  <Layout>
                    <AreasPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Issuance Routes - updated from Assignments */}
              <Route path="/issuance" element={
                <ProtectedRoute>
                  <Layout>
                    <IssuancePage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Repairs Routes */}
              <Route path="/repairs" element={
                <ProtectedRoute>
                  <Layout>
                    <RepairsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Users Routes */}
              <Route path="/users" element={
                <ProtectedRoute>
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Trails Routes */}
              <Route path="/trails" element={
                <ProtectedRoute>
                  <Layout>
                    <TrailsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Redirect to dashboard if already logged in */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
