
import React, {useEffect,useState} from 'react'
import API from '../api/axios'
import { useParams, useNavigate } from 'react-router-dom'
export default function BookDetails(){
  const {id} = useParams();
  const [data,setData]=useState(null);
  const [review, setReview] = useState({rating:5, reviewText:''});
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  const load = async ()=>{
    try{ const {data} = await API.get(`/books/${id}`); setData(data); }
    catch(err){ alert(err.response?.data?.message || err.message); }
  }
  useEffect(()=>{ load() },[id]);

  const addReview = async ()=>{
    try{ await API.post('/reviews', {bookId: id, ...review}); setReview({rating:5, reviewText:''}); load(); }
    catch(err){ alert(err.response?.data?.message || err.message); }
  }

  const deleteBook = async ()=>{
    if(!confirm('Delete book?')) return;
    try{ await API.delete(`/books/${id}`); nav('/'); }
    catch(err){ alert(err.response?.data?.message || err.message); }
  }

  const deleteReview = async (rid)=>{
    if(!confirm('Delete review?')) return;
    try{ await API.delete(`/reviews/${rid}`); load(); }
    catch(err){ alert(err.response?.data?.message || err.message); }
  }

  return data ? (
    <div className="max-w-3xl mx-auto mt-6 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold">{data.book.title}</h2>
      <div className="text-sm">By {data.book.author} — {data.book.publishedYear}</div>
      <p className="mt-3">{data.book.description}</p>
      <div className="mt-2">Average rating: {data.averageRating ?? 'No reviews'}</div>

      <div className="mt-4">
        <h3 className="font-semibold">Reviews</h3>
        {data.reviews.length===0 && <div>No reviews yet</div>}
        <ul className="space-y-2 mt-2">
          {data.reviews.map(r=> (
            <li key={r._id} className="border dark:border-gray-700 p-2 rounded">
              <div className="text-sm font-semibold">{r.userId?.name || 'User' } — {r.rating} ⭐</div>
              <div>{r.reviewText}</div>
              {user && user.id === r.userId._id && (
                <div className="mt-2"><button onClick={()=>deleteReview(r._id)} className="px-2 py-1 border rounded">Delete</button></div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Add review</h3>
        {user ? (
          <div className="space-y-2">
            <select value={review.rating} onChange={e=>setReview({...review, rating: Number(e.target.value)})} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <textarea value={review.reviewText} onChange={e=>setReview({...review, reviewText: e.target.value})} placeholder="Write review" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
            <button onClick={addReview} className="px-3 py-1 bg-blue-600 text-white rounded">Submit review</button>
          </div>
        ) : <div>Please <a href="/login" className="text-blue-600">login</a> to add review.</div>}
      </div>

      <div className="mt-4 flex space-x-2">
        {user && user.id === data.book.addedBy && (
          <>
            <button onClick={()=>nav(`/edit/${id}`)} className="px-3 py-1 border rounded">Edit Book</button>
            <button onClick={deleteBook} className="px-3 py-1 border rounded">Delete Book</button>
          </>
        )}
      </div>
    </div>
  ) : <div>Loading...</div>
}
