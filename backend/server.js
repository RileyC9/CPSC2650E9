import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";

// example derived from https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html

let _notes = [
  { id: "2", text: "CPSC 2650", img:null },
  { id: "1", text: "An awesome web dev Note", img:null },
];

// const tweets = [
//   { id: 1, body: "Lorem Ipsum", date: new Date(), author_id: 10 },
//   { id: 2, body: "Sic dolor amet", date: new Date(), author_id: 11 },
// ];
// const authors = [
//   {
//     id: 10,
//     username: "johndoe",
//     first_name: "John",
//     last_name: "Doe",
//     avatar_url: "acme.com/avatars/10",
//   },
//   {
//     id: 11,
//     username: "janedoe",
//     first_name: "Jane",
//     last_name: "Doe",
//     avatar_url: "acme.com/avatars/11",
//   },
// ];

// Schema definition
const typeDefs = `#graphql
  type Note {
    id: ID!
    text: String
    img: Image
  }

  type Image {
    links: HTML
    user: Author
    img: URLS
  }
    type HTML {
      html: String
    }

    type Author {
      name: String
    }

    type URLS {
      urls: [ImageLinks]
    }

    type ImageLinks {
    raw: String
    full: String
    regular: String
    small: String
    thumb: String
    small_s3: String
    }

  input ImageInput {
    id: ID
    links: HTMLInput
    user: AuthorInput
    img: URLSInput
  }

  input HTMLInput {
    html: String
  }

  input AuthorInput {
    name: String
  }

  input URLSInput {
    urls: [ImageLinksInput]
  }

  input ImageLinksInput {
    raw: String
    full: String
    regular: String
    small: String
    thumb: String
    small_s3: String
  }

  input NoteUpdates {
    text: String
    img: ImageInput
  }

  type Query {
    Note(id: ID!): Note
    Notes(limit: Int, sortField: String, sortOrder: String): [Note]
  }

  type Mutation {
    addNote(text: String, img: ImageInput): Note
    removeNote(id: ID!): Note
    editNote(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    Notes: () => _notes,
    Note: (_, { id }) => _notes.find((note) => note.id == id),
  },
  // User: {
  //   full_name: (author) => `${author.first_name} ${author.last_name}`,
  // },
  Mutation: {
    addNote: (_, { text, img }) => {
      const nextNoteId =
        (_notes.reduce((id, note) => {
          return Math.max(id, note.id);
        }, -1) + 1).toString();
      const newNote = {
        id: nextNoteId,
        text,
        img,
      };
      _notes.push(newNote);
      return newNote;
    },
    removeNote: (_, { id }) => {
      let deletedNote = _notes.filter((note)=> note.id === id);
      _notes = _notes.filter((note)=> note.id !== id);
      return deletedNote;
    },
    editNote: (_, { noteId, updates }) => {
      let result = false;
      _notes = _notes.forEach(note => {
        if (note.id === noteId) {
          note.text = updates.text,
          note.img = updates.img
          result = true;
        }
      })
      return result;
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
