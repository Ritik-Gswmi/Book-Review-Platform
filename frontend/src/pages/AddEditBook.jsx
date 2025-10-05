
import React, {useState, useEffect} from 'react'
import API from '../api/axios'
import { useNavigate, useParams } from 'react-router-dom'
export default function AddEditBook(){
  const {id} = useParams();
  const [form,setForm]=useState({title:'',author:'',description:'',genre:'',publishedYear:''});
  const nav = useNavigate();
  useEffect(()=>{ if(id){ API.get(`/books/${id}`).then(r=> setForm({
    title: r.data.book.title, author: r.data.book.author, description: r.data.book.description || '', genre: r.data.book.genre || '', publishedYear: r.data.book.publishedYear || ''
  })).catch(()=>{}); } },[id]);

  const submit = async e => {
  e.preventDefault();
  try {
    // Get logged in user ID
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId) {
      alert("User not logged in. Please log in again.");
      return;
    }

    // Attach userId to form
    const formWithUser = { ...form, userId };

    if (id) {
      await API.put(`/books/${id}`, formWithUser);
    } else {
      await API.post('/books', formWithUser);
    }

    nav('/');
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
};

  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <input required value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Author" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <input required value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} placeholder="Genre" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <input required value={form.publishedYear} onChange={e=>setForm({...form,publishedYear:e.target.value})} placeholder="Published Year" type="number" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">{id ? 'Update Book' : 'Add Book'}</button>
      </form>
    </div>
  )
}