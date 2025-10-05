
import React, {useState} from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const [form,setForm]=useState({email:'',password:''});
  const nav = useNavigate();
  const submit = async e=>{
    e.preventDefault();
    try{ const {data} = await API.post('/auth/login', form); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); nav('/'); }
    catch(err){ alert(err.response?.data?.message || err.message); }
  }
  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" type="password" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  )
}
