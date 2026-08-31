import { Routes, Route } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider} from '@/context/AuthProvider';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MyBooksPage from '@/pages/MyBooksPage';
import Footer from "@/components/Footer.tsx";

function App() {
  return (
      <AuthProvider>
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-books" element={<MyBooksPage />} />
            </Routes>
        </main>
         <Footer />
        <Toaster />
      </AuthProvider>
  );
}

export default App;