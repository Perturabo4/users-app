import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import CreateUserPage from '../duks/createUserPage/CreateUserPage'
import PostsPage from '../duks/postsPage/PostsPage'
import SinglePostPage from '../duks/singlePostPage/SinglePostPage'
import UsersPage from '../duks/usersPage/UsersPage'
import CustomizedSnackbar from '../duks/customizedSnackbar/CustomizedSnackbar'

const App = () => {
  return (
    <>
      <CustomizedSnackbar />
      <Routes>
        <Route path='/' element={<UsersPage />} />
        <Route path='/posts/:userId/:userName' element={<PostsPage />} />
        <Route path='/single-post/:postId' element={<SinglePostPage />} />
        <Route path='/create-user' element={<CreateUserPage />} />
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </>
  )
}

export default App
