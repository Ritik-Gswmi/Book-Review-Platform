
import React, {useEffect,useState} from 'react'
import API from '../api/axios'
import { Link } from 'react-router-dom'
export default function BookList(){
  const [books,setBooks]=useState([]);
  const [page,setPage]=useState(1);
  const [totalPages,setTotal]=useState(1);
  const load = async p=>{
    try{ const {data} = await API.get('/books?page='+p+'&limit=5'); setBooks(data.books); setPage(data.page); setTotal(data.totalPages); }
    catch(err){ alert(err.message); }
  }
  useEffect(()=>{ load(1) },[]);
  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Books</h2>
      <ul className="space-y-3">
        {books.map(b=> (
          <li key={b._id} className="p-4 bg-white rounded shadow">
            <Link to={`/books/${b._id}`} className="font-semibold">{b.title}</Link>
            <div className="text-sm">{b.author} — {b.publishedYear}</div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button disabled={page<=1} onClick={()=>load(page-1)} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page} / {totalPages}</div>
        <button disabled={page>=totalPages} onClick={()=>load(page+1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  )
}
