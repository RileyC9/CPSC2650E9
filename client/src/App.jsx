import React from "react";
import { useApolloClient, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import {createBrowserRouter, Outlet, RouterProvider, Route, Routes, createRoutesFromElements} from "react-router-dom"
import Navbar from './component/Navbar.jsx';
import NoteList from './pages/NoteList.jsx';
import About from './pages/About.jsx';
import Note from './pages/Note.jsx';
import './App.css'

function App() {
  const [notes, setNote] = useState([]);
  const [noteID, setNoteID] = useState(-1);
  const [loadingNow, setLoading] = useState(true);
  const [errorNow, setError] = useState(null);

  const client = useApolloClient();
  // let notes = [];
  // let noteId = 1
  const editHandler = (id) => {
    setNoteID(id);
    window.location.replace(`http://localhost:5173/note/${id}`)
  };

  const getNotes = gql`
  query {
    Notes {
      id
      text
      imgurl
      imgAuthor
      imgSmall
    }
  }
`;

    
  useEffect (() => {
    client
      .query({ query: getNotes })
      .then((result) => {
        setNote(result.data.Notes);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {

  }, [noteID])

  const router = createBrowserRouter(
    createRoutesFromElements (
      <>
        <Route element={
          <div className='grid grid-cols-20 grid-rows-20 h-screen gap-0'>
            <Navbar />
            <Outlet />
          </div>
          }>
          <Route path="/" element={<NoteList notes={notes} editHandler={editHandler}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/note/:id" element={<Note />} />
        </Route>
        </>
    )
  )

  // if (loadingNow) return <p>Loading...</p>;
  // if (errorNow) return <p>Error: {error.message}</p>;

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
export default App;
