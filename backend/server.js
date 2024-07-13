import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import nodeFetch from 'node-fetch';
import { createApi } from 'unsplash-js';

dotenv.config(); // Load environment variables

const key = process.env.UNSPLASHAPI;

const unsplash = createApi({
  accessKey: process.env.UNSPLASHAPI,
  fetch: nodeFetch.default,
});

// example derived from https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html

let _notes = [
  { id: "2", text: "CPSC 2650", imgurl:"", imgAuthor:"", imgSmall:"" },
  { id: "1", text: "An awesome web dev Note", imgurl:"", imgAuthor:"", imgSmall:"" },
];

// Schema definition
const typeDefs = `#graphql
  type Note {
    id: ID!
    text: String
    imgurl: String
    imgAuthor: String
    imgSmall: String
  }

  input Update {
    text: String!
    imgurl: String
    imgAuthor: String
    imgSmall: String
  }

  type Query {
    Note(id: ID!): Note
    Notes(limit: Int, sortField: String, sortOrder: String): [Note]
  }

  type Mutation {
    addNote(text: String ): Note
    removeNote(id: ID!): Note
    editNote(id: ID!, text: String, imgurl: String imgAuthor: String imgSmall: String): Note
    generateImage(id: ID!, searchTerm: String!): Note
  }
`;

const resolvers = {
  Query: {
    Notes: () => {
      console.log(_notes)
      return _notes},
    Note: (_, { id }) => _notes.find((note) => note.id == id),
  },
  Mutation: {
    addNote: (_, { text }) => {
      const nextNoteId =
        (_notes.reduce((id, note) => {
          return Math.max(id, note.id);
        }, 0) +1).toString();
      const newNote = {
        id: nextNoteId,
        text,
        imgurl: "",
        imgAuthor: "",
        imgSmall: "",
      };
      _notes.push(newNote);
      return newNote;
    },
    removeNote: (_, { id }) => {
      console.log(id)
      console.log("hi")
      let deletedNote = _notes.filter((note)=> note.id === id);
      _notes = _notes.filter((note)=> note.id !== id);
      console.log(_notes)
      
      return deletedNote;
    },
    editNote: (_, { id, text, imgurl, imgAuthor, imgSmall }) => {
      let result;
      console.log(id, text, imgurl, imgAuthor, imgSmall)
      _notes = _notes.map(note => {
        if (note.id === id) {
          note.text = text;
          note.imgurl = imgurl;
          note.imgAuthor = imgAuthor;
          note.imgSmall = imgSmall;
          result = note;
        }
        console.log(note)
        return note;
      })
      return result;
    },
    generateImage: async (_, { id, searchTerm }) => {
      let note = _notes.filter((note) => note.id === id);
      let term = searchTerm;
      try {
        // const result = (await fetch(`https://api.unsplash.com/search/photos?query=${note.text}&client_id=${key}`)).json();
        const result = (await unsplash.search.getPhotos({
          query: term,
          page: 1,
          perPage: 1,
        }));
        const image = result.response.results[0];
        console.log(image[0])
        if (image) {
          note.imgurl = image.links.html;
          note.imgAuthor = image.user.name;
          note.imgSmall = image.urls.small;
        }
        return note;
      }catch (err) {
        console.log(err);
      }
    }
  },
};

const app = express();

// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

// Launch the server
app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {})
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
