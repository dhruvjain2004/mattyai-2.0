import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyDesigns from "./pages/MyDesigns";
import EditDesign from "./pages/EditDesign";
import ProtectedRoute from "./components/ProtectedRoute";
import DesignEditor from "./pages/DesignEditor";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/canvas", element: <DesignEditor /> },
    { path: "/my-designs", element: (
        <ProtectedRoute>
          <MyDesigns />
        </ProtectedRoute>
      )
    },
    { path: "/admin", element: (
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      )
    },
    { path: "/edit/:id", element: (
        <ProtectedRoute>
          <EditDesign />
        </ProtectedRoute>
      )
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
