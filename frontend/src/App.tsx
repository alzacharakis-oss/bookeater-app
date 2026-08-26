import { Routes, Route } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider} from '@/context/AuthProvider';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MyBooksPage from '@/pages/MyBooksPage';

function App() {
  return (
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-books" element={<MyBooksPage />} />
            </Routes>
        </main>
        <Toaster />
      </AuthProvider>
  );
}

export default App;