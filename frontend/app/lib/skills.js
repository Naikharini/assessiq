export const SKILL_TOPICS = {
  React: [
    "Hooks",
    "State Management",
    "Lifecycle",
    "Components",
    "Context API",
    "Routing",
  ],
  JavaScript: [
    "ES6+",
    "Async/Await",
    "DOM",
    "Closures",
    "Prototypes",
    "Event Loop",
  ],
  Python: [
    "OOP",
    "Data Structures",
    "File I/O",
    "Decorators",
    "List Comprehensions",
    "Exception Handling",
  ],
  Java: [
    "OOP",
    "Collections",
    "Multithreading",
    "Exception Handling",
    "Streams",
    "Design Patterns",
  ],
  "Node.js": [
    "Express",
    "REST APIs",
    "Middleware",
    "Event Loop",
    "File System",
    "Authentication",
  ],
  SQL: [
    "Joins",
    "Indexing",
    "Subqueries",
    "Normalization",
    "Aggregations",
    "Transactions",
  ],
  "C++": [
    "Pointers",
    "OOP",
    "STL",
    "Memory Management",
    "Templates",
    "Data Structures",
  ],
  "Machine Learning": [
    "Supervised Learning",
    "Neural Networks",
    "Feature Engineering",
    "Model Evaluation",
    "Clustering",
    "NLP Basics",
  ],
  DSA: [
    "Arrays",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Sorting",
    "Hashing",
  ],
};

export const SKILLS = Object.keys(SKILL_TOPICS);

export function getTopicsForSkill(skill) {
  return SKILL_TOPICS[skill] || [];
}

export function getDefaultTopic(skill) {
  return getTopicsForSkill(skill)[0] || "";
}
