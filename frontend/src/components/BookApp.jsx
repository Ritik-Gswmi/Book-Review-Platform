
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../App";

function average(arr = []) {
  if (!arr.length) return 0;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
}

function ratingDistribution(ratings = []) {
  const dist = [0, 0, 0, 0, 0];
  ratings.forEach((r) => {
    const idx = Math.min(4, Math.max(0, Math.round(r) - 1));
    dist[idx]++;
  });
  return dist.map((count, i) => ({ rating: `${i + 1}`, count }));
}

function Controls({ genres, filters, setFilters, sort, setSort }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="search"
          placeholder="Search by title or author..."
          className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />

        <select
          value={filters.genre}
          onChange={(e) => setFilters((f) => ({ ...f, genre: e.target.value }))}
          className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="newest">Newest (year)</option>
          <option value="oldest">Oldest (year)</option>
          <option value="rating_desc">Rating (high → low)</option>
          <option value="rating_asc">Rating (low → high)</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={toggle}
          className="px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </div>
  );
}

function RatingChart({ ratings }) {
  const data = ratingDistribution(ratings);
  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="rating" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function BookItem({ book, onBookClick }) {
  const avg = average(book.ratings);
  return (
    <div onClick={() => onBookClick(book._id)} className="p-4 border rounded-md dark:border-gray-700 dark:bg-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <div className="text-sm opacity-80">{book.author} • {book.genre} • {book.year}</div>
                <div className="mt-2 text-sm">Average rating: <strong>{avg}</strong> ({book.ratings.length} ratings)</div>
            </div>
        </div>

        <div className="mt-3">
            <RatingChart ratings={book.ratings} />
        </div>
    </div>
  );
}

export default function BookApp({ books: initialBooks = null, totalPages: initialTotalPages = 1, onPageChange, onBookClick }) {
  const sample = [
    {
      // Note: API uses `_id`, sample uses `id`. The component should handle `_id`.
      _id: 'sample-1',
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      year: 2019,
      ratings: [5, 4, 4, 5, 3],
    },
    {
      _id: 'sample-2',
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      year: 2018,
      ratings: [5, 5, 4, 5, 5, 4],
    },
    {
      _id: 'sample-3',
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      genre: "Fiction",
      year: 2018,
      ratings: [4, 4, 3, 5, 4, 4],
    },
  ];

  const [books, setBooks] = useState(sample);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [filters, setFilters] = useState({ q: "", genre: "" });
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setBooks((initialBooks && initialBooks.length) ? initialBooks : sample);
  }, [initialBooks]);

  const genres = useMemo(() => {
    const s = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(s);
  }, [books]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let arr = books.filter((b) => {
      if (filters.genre && b.genre !== filters.genre) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    });

    arr = arr.map((b) => ({ ...b, avg: average(b.ratings) }));

    switch (sort) {
      case "newest":
        arr.sort((a, b) => b.year - a.year);
        break;
      case "oldest":
        arr.sort((a, b) => a.year - b.year);
        break;
      case "rating_desc":
        arr.sort((a, b) => b.avg - a.avg);
        break;
      case "rating_asc":
        arr.sort((a, b) => a.avg - b.avg);
        break;
    }

    return arr;
  }, [books, filters, sort]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    onPageChange(newPage);
  }, [onPageChange]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Book Reviews</h1>
          <div className="text-sm opacity-80">Showing {filtered.length} books</div>
        </header>

        <Controls genres={genres} filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} />

        <main className="grid gap-4">
          {filtered.map((book) => (
            <BookItem key={book._id} book={book} onBookClick={onBookClick} />
          ))}
        </main>

        <div className="flex justify-between items-center mt-6">
          <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} className="px-4 py-2 border rounded disabled:opacity-50 dark:border-gray-700">Prev</button>
          <div>Page {page} / {totalPages}</div>
          <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)} className="px-4 py-2 border rounded disabled:opacity-50 dark:border-gray-700">Next</button>
        </div>
      </div>
    </div>
  );
}
