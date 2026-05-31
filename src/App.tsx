import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TokenProvider } from './context/TokenContext'
import HomePage from './pages/HomePage'
import UsersPage from './pages/UsersPage'
import UserCardPage from './pages/UserCardPage'
import PostsPage from './pages/PostsPage'
import PostCardPage from './pages/PostCardPage'

export default function App() {
  return (
    <TokenProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserCardPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostCardPage />} />
        </Routes>
      </BrowserRouter>
    </TokenProvider>
  )
}
