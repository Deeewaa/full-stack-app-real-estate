import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import PropertyListing from "@/pages/PropertyListing";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertyForm from "@/pages/PropertyForm";
import Agents from "@/pages/Agents";
import Contact from "@/pages/Contact";
import UserProfile from "@/pages/UserProfile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      
      {/* Protected Routes */}
      <Route path="/">
        {() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/properties">
        {() => (
          <ProtectedRoute>
            <PropertyListing />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/properties/new">
        {() => (
          <ProtectedRoute>
            <PropertyForm />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/properties/edit/:id">
        {() => (
          <ProtectedRoute>
            <PropertyForm />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/properties/:id">
        {(params) => (
          <ProtectedRoute>
            <PropertyDetail />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/agents">
        {() => (
          <ProtectedRoute>
            <Agents />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/contact">
        {() => (
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/profile/:id">
        {() => (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route>
        {() => (
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
