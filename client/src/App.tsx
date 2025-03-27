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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={PropertyListing} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/properties/new" component={PropertyForm} />
      <Route path="/properties/edit/:id" component={PropertyForm} />
      <Route path="/agents" component={Agents} />
      <Route path="/contact" component={Contact} />
      <Route path="/profile/:id" component={UserProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
