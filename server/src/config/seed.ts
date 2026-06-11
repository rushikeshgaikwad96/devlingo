import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "../models/Lesson";

dotenv.config();

const lessonsData = [
  // ==================== JAVASCRIPT ====================
  {
    title: "Variables in JavaScript",
    language: "javascript",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which keyword declares a block-scoped variable that can be reassigned?",
        options: ["var", "let", "const", "static"],
        correct: "let",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete the keyword to declare a constant variable: ___ PI = 3.14;",
        correct: "const",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What is JavaScript variable hoisting?",
        options: [
          "Variables are deleted after execution",
          "Variable declarations are moved to the top of their scope",
          "Variables can only be declared at the bottom of the script",
          "Variables are pushed to a background worker process"
        ],
        correct: "Variable declarations are moved to the top of their scope",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Functions in JavaScript",
    language: "javascript",
    topic: "basics",
    order: 2,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which represents a valid basic arrow function returning 5?",
        options: ["() -> 5", "() => 5", "function() => 5", "=> 5"],
        correct: "() => 5",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: const greet = (name) ___ `Hello, ${name}`; (use arrow symbol)",
        correct: "=>",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What is a callback function in JavaScript?",
        options: [
          "A function that returns a promise",
          "A function passed as an argument to another function",
          "A function that calls itself recursively",
          "A method attached to the constructor class"
        ],
        correct: "A function passed as an argument to another function",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Arrays in JavaScript",
    language: "javascript",
    topic: "data structures",
    order: 3,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which array method returns a new array with all elements that pass a test condition?",
        options: ["map", "filter", "reduce", "forEach"],
        correct: "filter",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete to double each element: const doubled = arr.___((x) => x * 2);",
        correct: "map",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which method runs a reducer function on each element of the array to return a single output?",
        options: ["map", "filter", "reduce", "pop"],
        correct: "reduce",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Objects in JavaScript",
    language: "javascript",
    topic: "data structures",
    order: 4,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "How do you extract the 'name' property from a user object using destructuring?",
        options: [
          "const [ name ] = user;",
          "const { name } = user;",
          "const name = user.name();",
          "const name = user{name};"
        ],
        correct: "const { name } = user;",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete with the spread operator: const userCopy = { ___user };",
        correct: "...",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which operator is used to access object properties using dot notation?",
        options: ["->", ".", "::", "@"],
        correct: ".",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Async/Await in JavaScript",
    language: "javascript",
    topic: "advanced",
    order: 5,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which keyword forces a function to always return a Promise?",
        options: ["await", "promise", "async", "defer"],
        correct: "async",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: ___ { await fetchData(); } catch(err) { console.error(err); }",
        correct: "try",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Where can you use the 'await' keyword in standard JavaScript?",
        options: [
          "Anywhere inside a script file",
          "Only inside async functions",
          "Only inside generator loops",
          "Only inside standard class constructors"
        ],
        correct: "Only inside async functions",
        xpReward: 10,
      },
    ],
  },

  // ==================== PYTHON ====================
  {
    title: "Variables & Types",
    language: "python",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "What is the data type of the value 3.14 in Python?",
        options: ["int", "float", "double", "str"],
        correct: "float",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: is_active = ___ (use Python's uppercase boolean true)",
        correct: "True",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How do you convert an integer x to a string in Python?",
        options: ["x.to_string()", "str(x)", "string(x)", "toString(x)"],
        correct: "str(x)",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Lists in Python",
    language: "python",
    topic: "data structures",
    order: 2,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which method adds an element to the end of a list in Python?",
        options: ["add", "push", "append", "insert"],
        correct: "append",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: my_list = [1, 2, 3]; count = ___(my_list) (get list length)",
        correct: "len",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What is the output of the slicing expression [1, 2, 3, 4][1:3]?",
        options: ["[1, 2]", "[2, 3]", "[2, 3, 4]", "[1, 2, 3]"],
        correct: "[2, 3]",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Functions in Python",
    language: "python",
    topic: "basics",
    order: 3,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which keyword defines a function in Python?",
        options: ["function", "def", "func", "define"],
        correct: "def",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete with default argument: def greet(name___'User'):",
        correct: "=",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What is the purpose of *args in a function definition?",
        options: [
          "To force keyword arguments only",
          "To allow passing a variable number of positional arguments",
          "To define private class variables",
          "To return multiple values as a tuple"
        ],
        correct: "To allow passing a variable number of positional arguments",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Dictionaries in Python",
    language: "python",
    topic: "data structures",
    order: 4,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which method retrieves a dictionary value safely without throwing a KeyError if the key is missing?",
        options: ["find", "get", "retrieve", "lookup"],
        correct: "get",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: my_dict = {'name': 'Alice'}; name = my_dict.___('name')",
        correct: "get",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How do you fetch a list of all keys from a dictionary?",
        options: ["my_dict.keys()", "my_dict.get_keys()", "keys(my_dict)", "my_dict.all_keys()"],
        correct: "my_dict.keys()",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Classes in Python",
    language: "python",
    topic: "object oriented",
    order: 5,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "What is the constructor method named in a Python class?",
        options: ["constructor", "__init__", "initialize", "new"],
        correct: "__init__",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete the instance reference: class Dog: def __init__(___, name):",
        correct: "self",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How does Class B inherit from Class A in Python?",
        options: [
          "class B extends A:",
          "class B(A):",
          "class B inherits A:",
          "class B : public A:"
        ],
        correct: "class B(A):",
        xpReward: 10,
      },
    ],
  },

  // ==================== TYPESCRIPT ====================
  {
    title: "Basic Types",
    language: "typescript",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which type turns off type-checking completely for a variable?",
        options: ["unknown", "any", "void", "never"],
        correct: "any",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete type annotation: let age: ___ = 25;",
        correct: "number",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which type represents a value that is never returned?",
        options: ["void", "null", "never", "undefined"],
        correct: "never",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Interfaces",
    language: "typescript",
    topic: "types",
    order: 2,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "How do you specify that an interface field is optional?",
        options: [
          "Add ? after the field name",
          "Add * before the field name",
          "Use the optional keyword",
          "Specify the type as null"
        ],
        correct: "Add ? after the field name",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete interface field modifier to prevent edit: ___ id: number;",
        correct: "readonly",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which keyword defines an object contract shape in TypeScript?",
        options: ["contract", "shape", "interface", "struct"],
        correct: "interface",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Functions",
    language: "typescript",
    topic: "basics",
    order: 3,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "What is the return type of a function that does not return any value?",
        options: ["null", "undefined", "void", "never"],
        correct: "void",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete signature: function greet(): ___ { return 'Hello'; }",
        correct: "string",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How do you define a typed parameter in a function greet?",
        options: ["string name", "name(string)", "name: string", "name as string"],
        correct: "name: string",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Generics",
    language: "typescript",
    topic: "advanced",
    order: 4,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which symbol is standard to represent generic types?",
        options: ["G", "X", "T", "type"],
        correct: "T",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete generic function: function identity___(arg: T): T { return arg; }",
        correct: "<T>",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What does Array<number> represent?",
        options: [
          "A function returning an array",
          "An array containing only numbers",
          "A tuple of numbers",
          "An array of variable size"
        ],
        correct: "An array containing only numbers",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Utility Types",
    language: "typescript",
    topic: "advanced",
    order: 5,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which utility type converts all properties of Type to optional?",
        options: ["Omit", "Pick", "Partial", "Optional"],
        correct: "Partial",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: type UserNoPassword = ___<User, 'password'>; (removes field)",
        correct: "Omit",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which utility type constructs a type by picking specific keys from Type?",
        options: ["Omit", "Pick", "Select", "Partial"],
        correct: "Pick",
        xpReward: 10,
      },
    ],
  },

  // ==================== SQL ====================
  {
    title: "SELECT basics",
    language: "sql",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which SQL clause is used to filter records that meet a specific criteria?",
        options: ["SELECT", "FROM", "WHERE", "HAVING"],
        correct: "WHERE",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete query to fetch 5 records: SELECT * FROM users ___ 5;",
        correct: "LIMIT",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which SQL statement retrieves data from a database?",
        options: ["GET", "RETRIEVE", "SELECT", "EXTRACT"],
        correct: "SELECT",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Filtering",
    language: "sql",
    topic: "basics",
    order: 2,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which operator matches a value against wildcards?",
        options: ["MATCH", "LIKE", "COMPARE", "IN"],
        correct: "LIKE",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete query for age 20-30: SELECT * FROM users WHERE age ___ 20 AND 30;",
        correct: "BETWEEN",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which operator matches rows only if BOTH filters are true?",
        options: ["AND", "OR", "BOTH", "PLUS"],
        correct: "AND",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Joins",
    language: "sql",
    topic: "relationships",
    order: 3,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which JOIN returns records only if there is a match in both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
        correct: "INNER JOIN",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: SELECT * FROM orders INNER JOIN users ___ orders.user_id = users.id;",
        correct: "ON",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What does a LEFT JOIN return?",
        options: [
          "All rows from the left table and matching rows from the right",
          "Only rows matching in both tables",
          "All rows from both tables",
          "All rows from the right table and matching rows from the left"
        ],
        correct: "All rows from the left table and matching rows from the right",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Aggregation",
    language: "sql",
    topic: "basics",
    order: 4,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which clause groups rows with identical values into summary rows?",
        options: ["ORDER BY", "GROUP BY", "SUM BY", "SORT BY"],
        correct: "GROUP BY",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: SELECT ___(*) FROM users; (get user count)",
        correct: "COUNT",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which clause acts as a filter for GROUP BY categories?",
        options: ["WHERE", "HAVING", "LIMIT", "FILTER"],
        correct: "HAVING",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Indexes",
    language: "sql",
    topic: "performance",
    order: 5,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Why do we add database indexes?",
        options: [
          "To secure database access",
          "To speed up data retrieval queries",
          "To save disk storage space",
          "To automatically group data tables"
        ],
        correct: "To speed up data retrieval queries",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: CREATE ___ idx_username ON users(username);",
        correct: "INDEX",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which constraint uniquely identifies every record in a table?",
        options: ["UNIQUE KEY", "FOREIGN KEY", "PRIMARY KEY", "INDEX KEY"],
        correct: "PRIMARY KEY",
        xpReward: 10,
      },
    ],
  },

  // ==================== REACT ====================
  {
    title: "JSX basics",
    language: "react",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "What is JSX?",
        options: [
          "A type of CSS stylesheet",
          "A database query tool",
          "A syntax extension for JavaScript that looks like HTML",
          "A package management tool"
        ],
        correct: "A syntax extension for JavaScript that looks like HTML",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: function MyComp() { ___ <h1>Hello</h1>; }",
        correct: "return",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How do you pass a variable 'user' as a prop to a component in JSX?",
        options: [
          "<MyComp user=\"user\" />",
          "<MyComp user={user} />",
          "<MyComp user=user />",
          "<MyComp [user]=\"user\" />"
        ],
        correct: "<MyComp user={user} />",
        xpReward: 10,
      },
    ],
  },
  {
    title: "useState",
    language: "react",
    topic: "hooks",
    order: 2,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which hook adds local state to a functional React component?",
        options: ["useState", "useEffect", "useContext", "useRef"],
        correct: "useState",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: const [count, ___] = useState(0);",
        correct: "setCount",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What does calling the setState function trigger in React?",
        options: [
          "A full page reload",
          "A component re-render",
          "A print message in console",
          "A database update"
        ],
        correct: "A component re-render",
        xpReward: 10,
      },
    ],
  },
  {
    title: "useEffect",
    language: "react",
    topic: "hooks",
    order: 3,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "When does a useEffect with a dependency array `[]` run?",
        options: [
          "On every single render",
          "Only once, after the initial render",
          "Never",
          "Only when the component is unmounted"
        ],
        correct: "Only once, after the initial render",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete the dependency array to run once: useEffect(() => {}, ___);",
        correct: "[]",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How do you clean up side effects in a useEffect hook?",
        options: [
          "Call effect.cleanup()",
          "Return a cleanup function from the callback",
          "Pass a clean array parameter",
          "React deletes them automatically"
        ],
        correct: "Return a cleanup function from the callback",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Props & Events",
    language: "react",
    topic: "basics",
    order: 4,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "What click handler prop is used in React?",
        options: ["onclick", "onClick", "click", "onPress"],
        correct: "onClick",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: <input type='text' ___={(e) => val(e.target.value)} />",
        correct: "onChange",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Are props in React read-only or mutable?",
        options: ["Mutable", "Read-only", "Dynamic", "Global"],
        correct: "Read-only",
        xpReward: 10,
      },
    ],
  },
  {
    title: "Custom Hooks",
    language: "react",
    topic: "hooks",
    order: 5,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which prefix is mandatory when naming custom hooks?",
        options: ["get", "custom", "react", "use"],
        correct: "use",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete custom hook name: function ___Fetch(url) { ... }",
        correct: "use",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Why do we write custom hooks in React?",
        options: [
          "To speed up site load speed",
          "To extract and share component logic",
          "To define global styling classes",
          "To write server-side database commands"
        ],
        correct: "To extract and share component logic",
        xpReward: 10,
      },
    ],
  },

  // ==================== NODE.JS ====================
  {
    title: "Modules in Node",
    language: "nodejs",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which function imports a module in CommonJS modules?",
        options: ["import", "require", "load", "include"],
        correct: "require",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete CommonJS export statement: ___ = myFunction;",
        correct: "module.exports",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which file extension is used to force ES modules in Node?",
        options: [".js", ".cjs", ".mjs", ".ts"],
        correct: ".mjs",
        xpReward: 10,
      },
    ],
  },
  {
    title: "File System Module",
    language: "nodejs",
    topic: "core",
    order: 2,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which core Node module handles file operations?",
        options: ["path", "fs", "file", "os"],
        correct: "fs",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: fs.___('file.txt', 'utf8', (err, data) => {});",
        correct: "readFile",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What does the 'Sync' suffix mean in fs.readFileSync?",
        options: [
          "The function runs asynchronously",
          "The function executes synchronously",
          "The function runs in a worker thread",
          "None of the above"
        ],
        correct: "The function executes synchronously",
        xpReward: 10,
      },
    ],
  },
  {
    title: "HTTP Module",
    language: "nodejs",
    topic: "web",
    order: 3,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which method starts a basic HTTP web server?",
        options: ["startServer", "listen", "createServer", "createHttp"],
        correct: "createServer",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete request handler: http.createServer((req, ___) => { res.end('Ok'); });",
        correct: "res",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What parameters are passed to createServer callback?",
        options: [
          "Request (req) and Response (res)",
          "IncomingMessage (req) and ServerResponse (res)",
          "Socket (socket) and Server (server)",
          "None of the above"
        ],
        correct: "IncomingMessage (req) and ServerResponse (res)",
        xpReward: 10,
      },
    ],
  },
  {
    title: "NPM Package Manager",
    language: "nodejs",
    topic: "tooling",
    order: 4,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which file lists project dependencies and custom script commands?",
        options: ["package-lock.json", "package.json", "npm.config", "manifest.json"],
        correct: "package.json",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete NPM command: npm ___ express (to download dependency)",
        correct: "install",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "How do you execute a script command 'build' in NPM?",
        options: ["npm build", "npm run build", "node build", "npm execute build"],
        correct: "npm run build",
        xpReward: 10,
      },
    ],
  },
  {
    title: "EventEmitter Class",
    language: "nodejs",
    topic: "events",
    order: 5,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which class constructs and fires custom events in Node?",
        options: ["Event", "EventTrigger", "EventEmitter", "Listener"],
        correct: "EventEmitter",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: myEmitter.___('myEvent', () => {}); (listen to event)",
        correct: "on",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "Which method triggers an event to run all its registered listeners?",
        options: ["trigger", "emit", "fire", "call"],
        correct: "emit",
        xpReward: 10,
      },
    ],
  },
];

const seedLessons = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("Clearing lessons collection...");
    await Lesson.deleteMany({});

    console.log(`Inserting ${lessonsData.length} lessons...`);
    await Lesson.insertMany(lessonsData as any);

    console.log("Database seeded successfully with 30 lessons!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedLessons();