import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n-context";
import { Layout } from "@/components/layout/layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import MenuPage from "@/pages/menu";
import GalleryPage from "@/pages/gallery";
import EventsPage from "@/pages/events";
import ChefPage from "@/pages/chef";
import ReviewsPage from "@/pages/reviews";
import ReservationsPage from "@/pages/reservations";
import CateringPage from "@/pages/catering";
import ContactPage from "@/pages/contact";

import AdminLoginPage from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/index";
import AdminMenuPage from "@/pages/admin/menu-admin";
import AdminGalleryPage from "@/pages/admin/gallery-admin";
import AdminEventsPage from "@/pages/admin/events-admin";
import AdminReservationsPage from "@/pages/admin/reservations";
import AdminCateringPage from "@/pages/admin/catering-admin";
import AdminReviewsPage from "@/pages/admin/reviews";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function PublicRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/chef" component={ChefPage} />
        <Route path="/reviews" component={ReviewsPage} />
        <Route path="/reservations" component={ReservationsPage} />
        <Route path="/catering" component={CateringPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/menu" component={AdminMenuPage} />
      <Route path="/admin/gallery" component={AdminGalleryPage} />
      <Route path="/admin/events" component={AdminEventsPage} />
      <Route path="/admin/reservations" component={AdminReservationsPage} />
      <Route path="/admin/catering" component={AdminCateringPage} />
      <Route path="/admin/reviews" component={AdminReviewsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/admin/:rest*" component={AdminRouter} />
      <Route path="/admin" component={AdminRouter} />
      <Route component={PublicRouter} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
