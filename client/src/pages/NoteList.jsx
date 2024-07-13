import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from 'react';

 

function NoteList (props) {
  const [addingNewNote, setAddingNewNote] = useState(false);
  const [newNote, setNewNote] = useState("");

  const deleteNote = gql`
  mutation removeNote( $id: ID!) {
    removeNote(id: $id) {
      id
    }
  }
`;

const addNewNote = gql`
  mutation addNote($text: String!) {
    addNote(text: $text) {
      id
      text
      imgurl
      imgAuthor
      imgSmall
    }
  }`;


  // const [removeNote, { data, loading, error }] = useMutation(deleteNote);

  const [removeNote] = useMutation(deleteNote);
  const [addNewNoteMutation] = useMutation(addNewNote);

  const handleAddingNote = () => {
    setAddingNewNote(true)
  }

  const handleNewNoteContent = (e) => {
    setNewNote(e.target.value)
  }

  const handleNewNoteSubmit = async() => {
    await addNewNoteMutation({ variables: { text: newNote }})
    .then(response => {
        console.log('Note added:', response.data);
      })
      .catch(err => {
        console.error('Error adding note:', JSON.stringify(err, null, 2));
      });
    console.log(newNote)
    setAddingNewNote(false);
    window.location.reload();
  }

  async function deleteHandler (id)  {
    console.log(props)
    await removeNote({ variables: {id:id} })
      .then(response => {
        console.log('Note removed:', response.data);
      })
      .catch(err => {
        console.error('Error removing note:', JSON.stringify(err, null, 2));
      });
    window.location.reload();
  }
  console.log(props.notes)
  let notes = props.notes;
  notes = notes.map((note)=> {
    return <div key={note.id} className="note">
      {note.text}
      <button 
      type= "button"
      className="edit-btn"
      onClick={()=> props.editHandler(note.id)}
      > Edit</button>
      <button 
      type= "button"
      className="delete-btn"
      onClick={() => deleteHandler(note.id)}
      > Delete</button>
      {note.imgurl? 
      <>
      <br />
        <a href={note.imgurl}><img src={note.imgSmall} /></a>
        <div>
          photo by {note.imgAuthor}
        </div>
      </>:null}
    </div>});

  useEffect(()=> {
    setAddingNewNote(false);
  }, [])

  return (
    <>
    <h3>YANT</h3>
    <hr />
    {notes}
    <hr />
    {addingNewNote? 
    <>
      <input type="text" onChange={handleNewNoteContent}></input>
      <button onClick={handleNewNoteSubmit}>Add to notes</button>
    </>
    :
    <button onClick={handleAddingNote}>Add a new note</button>}
    
    </>
  )
}

export default NoteList;