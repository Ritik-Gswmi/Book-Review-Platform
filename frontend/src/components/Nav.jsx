
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
export default function Nav(){
  const nav = useNavigate();
  const user = localStorage.getItem('user');
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); nav('/login'); }
  return (
    <nav className="p-4 bg-white dark:bg-gray-800 shadow flex justify-between">
      <div className="font-bold"><Link to="/">Book Reviews</Link></div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        {user ? <><Link to="/add">Add Book</Link><button onClick={logout}>Logout</button></> : <><Link to="/login">Login</Link><Link to="/signup">Sign up</Link></>}
      </div>
    </nav>
  )
}
