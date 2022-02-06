import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import CreateUserPage from '../pages/CreateUserPage'
import HomePage from '../pages/HomePage'
import PostsPage from '../pages/PostsPage'
import SinglePostPage from '../pages/SinglePostPage'
import UsersPage from '../pages/UsersPage'
import CustomizedSnackbar from './SnackBar'

const HomePageText = () => <h1 style={{ textAlign: 'center' }}>Home Page</h1>

const App = () => {
  return (
    <>
      <CustomizedSnackbar />
      <Routes>
        <Route path='/' element={<HomePage />}>
          <Route index element={<HomePageText />} />
          <Route path='posts/:userId/:userName' element={<PostsPage />} />
          <Route path='single-post/:postId' element={<SinglePostPage />} />
          <Route path='create-user' element={<CreateUserPage />} />
          <Route path='all-users' element={<UsersPage />} />
          <Route path='*' element={<Navigate to={'/'} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
