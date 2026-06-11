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
    explanation: {
      description: "Variables are containers for storing data values. In modern JavaScript, variables are block-scoped when declared using 'let' and 'const'. You can reassign 'let' variables, but 'const' variables are read-only (constants) and cannot be reassigned after declaration.",
      syntax: "let variableName = value;\nconst constantName = value;",
      exampleCode: "let score = 10;\nscore = 15; // Reassignment is allowed\n\nconst gravity = 9.8;\n// gravity = 10; // Error: Assignment to constant variable\n\nconsole.log(score);\nconsole.log(gravity);",
      exampleOutput: "15\n9.8"
    },
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
    explanation: {
      description: "Functions are blocks of code designed to perform particular tasks. An arrow function expression provides a compact syntax for writing functions. Unlike standard function declarations, arrow functions do not bind their own 'this' value.",
      syntax: "const functionName = (params) => {\n  return value;\n};",
      exampleCode: "const add = (a, b) => a + b;\nconst greet = (name) => `Hello, ${name}!`;\n\nconsole.log(add(5, 3));\nconsole.log(greet(\"World\"));",
      exampleOutput: "8\nHello, World!"
    },
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
    explanation: {
      description: "Arrays are ordered lists used to store multiple elements in a single variable. Built-in methods let you query and transform arrays. The 'map()' method creates a new array by performing a function on each element, while 'filter()' returns elements that match a test condition.",
      syntax: "const newArray = arr.map(element => transform);\nconst filteredArray = arr.filter(element => booleanCondition);",
      exampleCode: "const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(x => x * 2);\nconst evens = numbers.filter(x => x % 2 === 0);\n\nconsole.log(doubled);\nconsole.log(evens);",
      exampleOutput: "[2, 4, 6, 8]\n[2, 4]"
    },
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
    explanation: {
      description: "Objects are collections of key-value pairs. Destructuring syntax lets you unpack properties directly into distinct variables. The spread operator (...) allows copying or merging fields from one object to another.",
      syntax: "const { prop1, prop2 } = object;\nconst copyObj = { ...originalObj };",
      exampleCode: "const user = { name: 'Alex', age: 24 };\nconst { name, age } = user;\nconst copy = { ...user, active: true };\n\nconsole.log(name);\nconsole.log(copy.active);",
      exampleOutput: "Alex\ntrue"
    },
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
    explanation: {
      description: "Async/Await makes asynchronous promise-based code read like synchronous code. The 'async' keyword declares a function that returns a Promise. The 'await' keyword pauses execution until the promise resolves, allowing errors to be captured using 'try/catch' blocks.",
      syntax: "async function getData() {\n  try {\n    const res = await fetch(url);\n  } catch (err) {\n    // handle error\n  }\n}",
      exampleCode: "const getMessage = () => Promise.resolve(\"Hello!\");\n\nasync function printMsg() {\n  try {\n    const msg = await getMessage();\n    console.log(msg);\n  } catch (e) {\n    console.log(\"Error\", e);\n  }\n}\n\nprintMsg();",
      exampleOutput: "Hello!"
    },
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
    explanation: {
      description: "Python has dynamic typing, meaning variables do not require explicit type declarations. The interpreter infers the type automatically. Standard types include integers (int), decimals (float), booleans (bool), and text (str).",
      syntax: "variable_name = value",
      exampleCode: "age = 25          # int\nprice = 19.99      # float\nis_active = True   # bool\nname = \"Alice\"     # str\n\nprint(type(age))\nprint(is_active)",
      exampleOutput: "<class 'int'>\nTrue"
    },
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
    explanation: {
      description: "Lists are ordered, mutable sequences in Python. You can add items using 'append()', delete items with 'remove()', and query list size using 'len()'. Slices let you retrieve subsets using '[start:stop]' syntax.",
      syntax: "my_list = [items]\nmy_list.append(item)\nsub = my_list[start:stop]",
      exampleCode: "items = [10, 20, 30, 40]\nitems.append(50)\n\nprint(len(items))\nprint(items[1:3])",
      exampleOutput: "5\n[20, 30]"
    },
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
    explanation: {
      description: "Functions in Python are defined with the 'def' keyword. They can return values using 'return' and support default parameter values. The '*args' symbol enables passing an arbitrary number of positional arguments.",
      syntax: "def function_name(param1, param2=default, *args):\n    # logic\n    return value",
      exampleCode: "def greet(name=\"Guest\"):\n    return f\"Hello, {name}\"\n\ndef total(*args):\n    return sum(args)\n\nprint(greet())\nprint(total(1, 2, 3, 4))",
      exampleOutput: "Hello, Guest\n10"
    },
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
    explanation: {
      description: "Dictionaries store collections of key-value pairs. Keys must be unique and immutable. You can retrieve values safely using the 'get()' method, which returns 'None' (or a specified default) if the key does not exist.",
      syntax: "my_dict = {key: value}\nval = my_dict.get(key, default)",
      exampleCode: "user = {\"username\": \"coder\", \"status\": \"active\"}\nprint(user.get(\"username\"))\nprint(user.get(\"age\", \"N/A\"))",
      exampleOutput: "coder\nN/A"
    },
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
    explanation: {
      description: "Classes are blue-prints for creating objects. The '__init__' method serves as the class constructor. The first parameter of class methods is 'self', representing the current object instance. Inheritance is done by passing the base class in parentheses.",
      syntax: "class SubClass(BaseClass):\n    def __init__(self, name):\n        super().__init__()\n        self.name = name",
      exampleCode: "class Animal:\n    def __init__(self, species):\n        self.species = species\n\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(\"Dog\")\n        self.name = name\n\nd = Dog(\"Buddy\")\nprint(d.name, d.species)",
      exampleOutput: "Buddy Dog"
    },
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
    explanation: {
      description: "TypeScript extends JavaScript by adding static types. Built-in basic types include string, number, and boolean. The 'any' type disables type-checking, while 'never' represents values that are never returned (e.g. infinite loops or error throws).",
      syntax: "let name: string = \"Alice\";\nlet age: number = 30;",
      exampleCode: "let message: string = \"Hello World\";\nlet code: any = 101;\ncode = \"changed\"; // Allowed since type is any\n\nconsole.log(message);\nconsole.log(code);",
      exampleOutput: "Hello World\nchanged"
    },
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
    explanation: {
      description: "Interfaces define a structure contract for objects. Properties can be marked as optional using the '?' modifier, or read-only using the 'readonly' prefix to prevent field reassignments after instantiation.",
      syntax: "interface User {\n  readonly id: number;\n  name: string;\n  role?: string;\n}",
      exampleCode: "interface User {\n  readonly id: number;\n  name: string;\n  role?: string;\n}\n\nconst admin: User = { id: 101, name: \"Alice\" };\n// admin.id = 102; // Error: Cannot assign to 'id' because it is a read-only property.",
      exampleOutput: "{ id: 101, name: \"Alice\" }"
    },
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
    explanation: {
      description: "TypeScript functions validate parameter types and the return type. If a function is built to execute side effects without returning any value, it should be annotated with the 'void' type.",
      syntax: "function myFunc(param: type): returnType {\n  return value;\n}",
      exampleCode: "function add(a: number, b: number): number {\n  return a + b;\n}\n\nfunction log(msg: string): void {\n  console.log(msg);\n}\n\nconsole.log(add(5, 5));",
      exampleOutput: "10"
    },
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
    explanation: {
      description: "Generics enable components to work with varying types rather than a single one. This maintains strict type safety by passing the type argument inside angle brackets, like '<T>' representing the generic type parameter.",
      syntax: "function funcName<T>(arg: T): T {\n  return arg;\n}",
      exampleCode: "function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst numVal = identity<number>(10);\nconst strVal = identity<string>(\"DevLingo\");\nconsole.log(numVal, strVal);",
      exampleOutput: "10 DevLingo"
    },
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
    explanation: {
      description: "TypeScript provides utility types to facilitate type transformations. 'Partial<T>' sets all fields to optional, 'Pick<T, Keys>' selects subset fields, while 'Omit<T, Keys>' constructs a type by removing specific keys.",
      syntax: "type UpdateUser = Partial<User>;\ntype PublicUser = Omit<User, 'password'>;",
      exampleCode: "interface User {\n  id: number;\n  username: string;\n  email: string;\n}\n\ntype Summary = Pick<User, \"id\" | \"username\">;\nconst s: Summary = { id: 1, username: \"coder\" };\nconsole.log(s);",
      exampleOutput: "{ id: 1, username: 'coder' }"
    },
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
    explanation: {
      description: "The SELECT statement retrieves data columns from a database table. Use the FROM clause to specify the target table, WHERE to filter rows based on conditions, and LIMIT to cap the number of records returned.",
      syntax: "SELECT col1, col2\nFROM table_name\nWHERE condition\nLIMIT count;",
      exampleCode: "SELECT id, username \nFROM users \nWHERE active = 1 \nLIMIT 2;",
      exampleOutput: "id | username\n---|---------\n1  | alice   \n2  | bob"
    },
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
    explanation: {
      description: "SQL filters rows with boolean operators: AND (both conditions), OR (any condition), and NOT. The BETWEEN operator filters within ranges, and LIKE handles wildcard matches ('%' matches zero or more characters).",
      syntax: "SELECT * FROM products\nWHERE price BETWEEN 10 AND 50\nAND name LIKE 'A%';",
      exampleCode: "SELECT * FROM users \nWHERE age BETWEEN 20 AND 30 \nAND email LIKE '%@gmail.com';",
      exampleOutput: "id | email           | age\n---|-----------------|---\n3  | user@gmail.com  | 25"
    },
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
    explanation: {
      description: "JOIN statements merge columns from two tables based on relationships. INNER JOIN extracts rows matching in both tables. LEFT JOIN extracts all rows from the left table and matched ones from the right table (filling NULL for mismatches).",
      syntax: "SELECT columns FROM tableA\nINNER JOIN tableB\nON tableA.id = tableB.foreign_id;",
      exampleCode: "SELECT orders.id, users.username\nFROM orders\nINNER JOIN users\nON orders.user_id = users.id;",
      exampleOutput: "id  | username\n----|---------\n101 | alice   \n102 | bob"
    },
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
    explanation: {
      description: "Aggregations compute a single result from multiple row values (COUNT, SUM, AVG). GROUP BY partitions records into categories, and HAVING filters aggregates (similar to how WHERE filters rows).",
      syntax: "SELECT col, COUNT(*)\nFROM table\nGROUP BY col\nHAVING COUNT(*) > value;",
      exampleCode: "SELECT department, AVG(salary)\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 60000;",
      exampleOutput: "department | AVG(salary)\n-----------|-----------\nTech       | 85000.00"
    },
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
    explanation: {
      description: "Indexes speed up data queries at the cost of write storage. PRIMARY KEY constraints auto-generate indexes. You can explicitly instantiate indexes on search queries using the CREATE INDEX keyword.",
      syntax: "CREATE INDEX idx_name\nON table_name (column_name);",
      exampleCode: "CREATE INDEX idx_users_email \nON users (email);\n\n-- Running this is now indexed:\nSELECT * FROM users WHERE email = \"test@email.com\";",
      exampleOutput: "Index idx_users_email created successfully."
    },
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
    explanation: {
      description: "JSX is a markup syntax extension for JavaScript. It permits HTML declarations in React components. Embedded expressions are parsed using curly braces `{}` and component properties are passed as props arguments.",
      syntax: "const Element = () => {\n  return <div id={value}>Text</div>;\n};",
      exampleCode: "function Welcome({ name }) {\n  return <h1 className=\"title\">Welcome, {name}!</h1>;\n}\n\n// Usage: <Welcome name=\"Alice\" />",
      exampleOutput: "<h1 class=\"title\">Welcome, Alice!</h1>"
    },
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
    explanation: {
      description: "The 'useState' hook adds state to React functional components. It yields an array containing the current state value and a setter function. Executing the state updater triggers component re-rendering to keep UI reactive.",
      syntax: "const [state, setState] = useState(initialValue);",
      exampleCode: "import { useState } from 'react';\n\nfunction Clicker() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>\n  );\n}",
      exampleOutput: "[Clicking increments the button number counter dynamically]"
    },
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
    explanation: {
      description: "The 'useEffect' hook executes side effects after render. It supports a dependency array; an empty array '[]' ensures execution occurs once on mount. Returning a callback handles resource cleanup on unmount.",
      syntax: "useEffect(() => {\n  // effect code\n  return () => { /* cleanup */ };\n}, [deps]);",
      exampleCode: "import { useEffect } from 'react';\n\nfunction ConsoleLogger() {\n  useEffect(() => {\n    console.log(\"Mounted!\");\n    return () => console.log(\"Unmounted!\");\n  }, []);\n  return <p>Console Logger Active</p>;\n}",
      exampleOutput: "Mounted!"
    },
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
    explanation: {
      description: "Props act as read-only properties to configure components. To handle user interactions, assign callback handlers to event listener props like 'onClick' (clicks) or 'onChange' (inputs).",
      syntax: "<button onClick={handleClick}>Label</button>",
      exampleCode: "function CustomButton({ label, onClick }) {\n  return (\n    <button onClick={onClick} className=\"bg-primary p-2\">\n      {label}\n    </button>\n  );\n}",
      exampleOutput: "[CustomButton calls the parent custom function when clicked]"
    },
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
    explanation: {
      description: "Custom Hooks let you extract and reuse logic across component trees. They are written as JavaScript functions whose names prefix with 'use', allowing internal calls to standard React hooks.",
      syntax: "function useFeature() {\n  const [state, setState] = useState();\n  return state;\n}",
      exampleCode: "import { useState, useEffect } from 'react';\n\nfunction useOnline() {\n  const [isOnline, setIsOnline] = useState(navigator.onLine);\n  useEffect(() => {\n    const ping = () => setIsOnline(true);\n    const offline = () => setIsOnline(false);\n    window.addEventListener(\"online\", ping);\n    window.addEventListener(\"offline\", offline);\n    return () => {\n      window.removeEventListener(\"online\", ping);\n      window.removeEventListener(\"offline\", offline);\n    };\n  }, []);\n  return isOnline;\n}",
      exampleOutput: "[Dynamically returns connection status boolean]"
    },
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
    explanation: {
      description: "Node.js organizes codes in module scripts. CommonJS modules use 'require()' to load packages and assign exports to 'module.exports'. Alternatively, ES Modules leverage the 'import' and 'export' keywords.",
      syntax: "const pkg = require(\"package\");\nmodule.exports = exportedVal;",
      exampleCode: "// helper.js\nmodule.exports.greet = () => \"Hello Node!\";\n\n// main.js\nconst helper = require(\"./helper\");\nconsole.log(helper.greet());",
      exampleOutput: "Hello Node!"
    },
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
    explanation: {
      description: "The built-in 'fs' module provides APIs to read, write, and delete files. It includes asynchronous APIs (using callbacks/promises) and blocking synchronous API methods (indicated by the 'Sync' suffix).",
      syntax: "const fs = require('fs');\nfs.readFile(path, encoding, callback);",
      exampleCode: "const fs = require('fs');\nfs.writeFileSync(\"hello.txt\", \"Hi Node!\");\nconst text = fs.readFileSync(\"hello.txt\", \"utf8\");\nconsole.log(text);",
      exampleOutput: "Hi Node!"
    },
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
    explanation: {
      description: "The native 'http' module allows Node to spin up a web server. Calling 'createServer()' creates a server process that captures incoming requests ('req') and writes responses ('res').",
      syntax: "const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.end('response content');\n});\nserver.listen(port);",
      exampleCode: "const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Ok');\n});\nserver.listen(3000, () => console.log('Listening'));",
      exampleOutput: "Listening"
    },
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
    explanation: {
      description: "NPM stands for Node Package Manager. The 'package.json' manifest files in workspaces declare metadata configurations, script shortcuts, and download dependencies required for runtime execution.",
      syntax: "npm install <pkg>\nnpm run <script>",
      exampleCode: "// package.json snippet:\n{\n  \"name\": \"app\",\n  \"dependencies\": {\n    \"express\": \"^5.0.0\"\n  },\n  \"scripts\": {\n    \"dev\": \"nodemon server.js\"\n  }\n}",
      exampleOutput: "[installs libraries and lists them under node_modules]"
    },
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
    explanation: {
      description: "Node.js leverages event-driven patterns using the 'events' module's 'EventEmitter' class. It enables objects to bind custom listeners using 'on()' and broadcast notifications using 'emit()'.",
      syntax: "const EventEmitter = require('events');\nconst emitter = new EventEmitter();\nemitter.on('event', callback);\nemitter.emit('event', args);",
      exampleCode: "const EventEmitter = require('events');\nconst emitter = new EventEmitter();\n\nemitter.on(\"status\", (status) => console.log(`Server status: ${status}`));\nemitter.emit(\"status\", \"online\");",
      exampleOutput: "Server status: online"
    },
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