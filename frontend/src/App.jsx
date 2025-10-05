
import React, { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Nav from './components/Nav'
import Signup from './pages/Signup'
import Login from './pages/Login'
import BookDetails from './pages/BookDetails'
import AddEditBook from './pages/AddEditBook'
import ProtectedRoute from './components/ProtectedRoute'
import BookApp from './components/BookApp';
import API from './api/axios';

export const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);


const HomePage = () => {
  const nav = useNavigate();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBooks = (pageNum) => {
    API.get(`/books?page=${pageNum}&limit=5`).then(res => {
      const adaptedBooks = res.data.books.map(b => ({...b, year: b.publishedYear, ratings: []}));
      setBooks(adaptedBooks);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    }).catch(err => console.error("Failed to fetch books:", err));
  };

  useEffect(() => {
    loadBooks(page);
  }, [page]);

  const handleBookClick = (bookId) => nav(`/books/${bookId}`);

  return <BookApp books={books} totalPages={totalPages} onPageChange={setPage} onBookClick={handleBookClick} />;
}
export default function App(){
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/books/:id" element={<BookDetails/>} />
          <Route path="/add" element={<ProtectedRoute><AddEditBook/></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><AddEditBook/></ProtectedRoute>} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}