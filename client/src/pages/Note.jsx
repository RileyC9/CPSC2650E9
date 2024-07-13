import { useEffect, useState } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import axios from "axios";
function Note () {
  const [note, setNote] = useState({});
  const [noteID, setNoteID] = useState(0);
  const [newNote, setNewNote] = useState()
  const [img, setImg] = useState(null);
  const [imgFetched, setImgFetched] = useState(false);

  const editNote = gql`
  mutation addNote( $id: ID!, $text: String, $imgurl: String $imgAuthor: String $imgSmall: String) {
    editNote(id: $id, text:$text, imgurl:$imgurl, imgAuthor:$imgAuthor, imgSmall:$imgSmall) {
      id
      text
      imgurl
      imgAuthor
      imgSmall
    }
  }`;

  const fetchNoteById = gql`
    query Note ( $noteId: ID!) {
      Note(id: $noteId ) {
        id
        text
      }
}
  `

  const generateImage = gql`
  mutation generateImage ($id: ID!, $searchTerm:String!) {
    generateImage(id: $id, searchTerm: $searchTerm) {
      imgurl
      imgAuthor
      imgSmall
    }
  }
  `
  const client = useApolloClient();
  const [editNoteMutation] = useMutation(editNote);
  const [generateImageMutation] = useMutation(generateImage);

  const taskInput = (e) => {
    setNewNote(e.target.value);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      let createNote = {
        text: newNote,
        imgurl: img.imgurl || "",
        imgAuthor: img.imgAuthor || "",
        imgSmall: img.imgSmall || ""
      }
      setImg(createNote);
      //   await editNoteMutation({ variables: { noteId: noteID, text: createNote.text, imgurl: createNote.imgurl, imgAuthor: createNote.imgAuthor, imgSmall: createNote.imgSmall }});
      // } else {
        await editNoteMutation({ variables: { id: noteID, text: newNote, imgurl: img.imgurl, imgAuthor: img.imgAuthor, imgSmall: img.imgSmall }})
      // }
    window.location.replace("http://localhost:5173/")
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
  }

  const generatingImage = async (e) => {
    console.log(typeof(noteID))
    e.preventDefault();
    try {
      // console.log(newNote)
      let result = (await generateImageMutation({ variables: { id: noteID, searchTerm: newNote }})).data.generateImage;
      console.log(result);
      if(result.imgurl){
        
        let img = {
          imgurl: result.imgurl,
          imgAuthor: result.imgAuthor,
          imgSmall: result.imgSmall
        }
        console.log(img)
        setImg(img);
        setImgFetched(true);
      } 
      // window.location.reload();
      else {
        setImg(null)
      }
    }catch (err) {
      console.log(JSON.stringify(err, null, 2))
    }
  }

  useEffect(() => {
    const url = window.location.toString();
    let id;
    let lastSlash = url.lastIndexOf('/')
    id = url.slice(lastSlash+1)
    let resultFetched;
    setNoteID(id);


    (async() => {
      client
      .query({ 
        query: fetchNoteById,
        variables: { "noteId": id }
      })
      .then((result) => {
        resultFetched = result;
        console.log(resultFetched)
        setNote(result.data.Note);
        setNewNote(result.data.Note.text)
        if (result.data.Note.imgurl){
        let oldimg = {
          imgurl: result.imgurl,
          imgAuthor: result.imgAuthor,
          imgSmall: result.imgSmall
        }
        setImg(oldimg)
      }
      })
      .catch((error) => {
        console.log(JSON.stringify(error, null, 2))
      });
      
      
    })()
  }, [])


  return (
    <>
    <h3>note id: {note.id}</h3>
    <hr />
    <form>
      <label>
        Task:
        <input type="text" name="taskName" id={noteID} defaultValue={note.text} onChange={taskInput}/>
      </label>
      <button onClick={generatingImage}>Generate an image</button>
      <button type="submit" onClick={handleSubmit}>Save</button>
      {imgFetched? <>
        <a href={img.imgurl}>
          <img src={img.imgSmall} />
        </a>
        <div>
          photo by {img.imgAuthor}
        </div>
      </>:
        <div>Image not found</div>}
      
    </form>
    </>
  )
}

export default Note;