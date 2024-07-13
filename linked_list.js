let LinkedList = [
  {
    head: 0,
    length: 4
  }
];
let Nodes = [
  {
    id: 0,
    value: "This is CPSC 2650",
    next: 1
  },
  {
    id: 1,
    value: "Full-stack Development II",
    next: 2
  },
  {
    id: 2,
    value: "Summer 2024",
    next:3
  },
  {
    id: 3,
    value: "Assignment 9",
    next: -1
  }
];


// Schema definition for linked list
const typeDefs = `#graphql
  type LinkedList {
    head: Node
    length: Int!
  }

  type Node {
    id: Int!
    value: String!
    next: Node
  }

  type Query {
    getLinkedList: LinkedList
  }

  type Mutation {
    addNode( value: String!): LinkedList
  }
`;

const getNodeById = (id) => {
  return Nodes.find(node => node.id === id);
}

const addNodeToEnd = (linkedList, newValue) => {
  if (typeof(value) == String) {
    const newNode = {
      id: linkedList.length,
      value: newValue,
      next: -1
    }
    Nodes.push(newNode);
    if (linkedList.head) {
      let currentNode = getNodeById(linkedList.head);
      while (currentNode.next != -1) {
        currentNode = getNodeById(currentNode.next);
      }
      currentNode.next = newNode.id;
      
      return linkedList;
    } else {
      linkedList.head = newNode.id;
    }
    linkedList.length++;
  }
  return linkedList;
}
const resolvers = {
  Query: {
    getLinkedList: () => LinkedList
  },
  LinkedList: {
    head: (list) => getNodeById(list.head),
    length: (list) => list.length
  },
  Mutatiion: {
    addNode: (_, { value }) => {
      LinkedList = addNodeToEnd(LinkedList, value);
      return LinkedList;
    }
  },
  Node: {
    next: (node) => getNodeById(node.next)
  }
}