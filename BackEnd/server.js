const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Initialize Express app for handling HTTP requests  
// and responses 
// Enable CORS for cross-origin requests  
// and JSON parsing for request bodies  
// in Express applications  
// Set up MySQL database connection
// and define API endpoints for CRUD operations 
// on student records
// including adding, retrieving, updating, and deleting records 
// as well as various filtering and sorting functionalities
// based on student attributes like marks and city
// Finally, start the server to listen on port 5000 
// for incoming requests  
const app = express();
app.use(cors());
app.use(express.json()); // <-- required for POST body
// Important notes before running server. 
// - Create MySQL connection  
// - Update the database configuration as per your setup
// - Make sure to create a database named mydatabase and 
//    a table named 'student_record' with appropriate columns
//    before running this server

// To create your own database, follow the following steps:
// - Open XAMMP (install it it if you do not it)

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3307,   // or 3306 depending on your XAMPP config
  password: '',
  database: "mydatabase"
});

// Connect to MySQL database
// get student records
app.get('/student_record', (req, res) => {
  db.query('SELECT * FROM student_record', (err, results) => {
    if (err) {
      console.error("Database error:", err); // 👈 this will show the real problem
      return res.status(500).json({ error: "Error retrieving data", details: err.message });
    }
    res.json(results);
  });
});

// add a new student
app.post("/addStudent", (req, res) => {
  console.log("Received request body:", req.body); // log the request body
  const { name, email, mark, city } = req.body;
  const sql = "INSERT INTO student_record (name, email, mark, city) VALUES (?, ?, ?,?)";
  db.query(sql, [name, email, mark, city], (err, result) => {
    if (err)         
      console.error("MySQL error:", err); // log the actual error
    return res.send("Student added successfully!");
  });
});

// Update a student by ID
// Update by name
app.put("/updateStudentById/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, mark, city } = req.body;
  const sql = "UPDATE student_record SET name = ?, email = ?, mark = ?, city = ? WHERE id = ?"; 
  db.query(sql, [name, email, mark, city, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).send("No student found with that ID");
    res.send("Student updated successfully!");
  });
});

// Update by name
app.put("/updateStudentByName/:name", (req, res) => {
  const { name } = req.params;  // get name from URL parameter
  const {email, mark, city } = req.body; // get updated details from request body 
  // SQL query to update student record based on name
  const sql = "UPDATE student_record SET email = ?, mark = ?, city = ? WHERE name = ?";
  // Execute the query with provided values 
  db.query(sql, [ name], (err, result) => {
    // Handle errors and send appropriate responses 
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) 
      // error if no rows were affected
      return res.status(404).send("No student found with that name: "+name);
    // Send success response
    res.send("Student updated successfully!");
  });
});

// Delete by name
app.delete("/deleteStudentByName/:name", (req, res) => {
  const { name } = req.params; // get name from URL parameter
  const sql = "DELETE FROM student_record WHERE name = ?"; // SQL query to delete student record based on name
  // Execute the query with provided name 
  db.query(sql, [name], (err, result) => { // Handle errors and send appropriate responses
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).send("No student found with that name");
    res.send("Student deleted successfully!");
  });
});

// delete all students
app.delete("/deleteAllStudents", (req, res) => {
  const sql = "DELETE FROM student_record";   
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.send("All students deleted successfully!");
  });
}
);
// Get a student by ID
app.get("/getStudent/:id", (req, res) => {
  const { id } = req.params;  
  const sql = "SELECT * FROM student_record WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  }); 
});

// update a student's mark by ID
app.put("/updateMark/:id", (req, res) => {
  const { id } = req.params;    
  const { mark } = req.body;
  const sql = "UPDATE student_record SET mark = ? WHERE id = ?";  
  db.query(sql, [mark, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.send("Student mark updated successfully!");
  });
});

// update a student's city by name
app.put("/updateCity/:name", (req, res) => {
  const { name } = req.params;  
  const { city } = req.body;
  const sql = "UPDATE student_record SET city = ? WHERE id = ?";  
  db.query(sql, [city, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.send("Student city updated successfully!");
  });
});

// update a student's email by ID
app.put("/updateEmail/:id", (req, res) => {
  const { id } = req.params;      
  const { email } = req.body; 
  const sql = "UPDATE student_record SET email = ? WHERE id = ?";  
  db.query(sql, [email, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.send("Student email updated successfully!");
  });
});

// update a student's name by ID
app.put("/updateName/:id", (req, res) => {
  const { id } = req.params;  
  const { name } = req.body;
  const sql = "UPDATE student_record SET name = ? WHERE id = ?";        
  db.query(sql, [name, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.send("Student name updated successfully!");
  });
}); 

// get all students with mark greater than a value
app.get("/studentsWithMarkGreaterThan/:mark", (req, res) => {
  const { mark } = req.params;    
  const sql = "SELECT * FROM student_record WHERE mark > ?";
  db.query(sql, [mark], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
}); 

// get all students from a specific city
app.get("/fromSameCity/:city", (req, res) => {
  const { city } = req.params;      
  const sql = "SELECT * FROM student_record WHERE city = ?";
  db.query(sql, [city], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// get all students those have passed (mark >= 50)
app.get("/passedStudents", (req, res) => {  
  const sql = "SELECT * FROM student_record WHERE mark >= 50";  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  }
);
});

// get all students those have failed (mark < 50)
app.get("/failedStudents", (req, res) => {  
  const sql = "SELECT * FROM student_record WHERE mark < 50";   
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
}); 

// get total number of students
app.get("/totalStudents", (req, res) => { 
  const sql = "SELECT COUNT(*) AS total FROM student_record";           
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// get students sorted by mark in descending order
app.get("/studentsSortedByMark", (req, res) => {  
  const sql = "SELECT * FROM student_record ORDER BY mark DESC";          
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// get students with mark greater than 90
app.get("/topStudents", (req, res) => {  
  const sql = "SELECT * FROM student_record WHERE mark >= 80";     
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get students above a given mark
// in the front end, call this endpoint like:
// axios.get(`http://localhost:5000/studentsAbove/${threshold}`);
// where 'threshold' is the mark value
// to filter students above that mark
// e.g., to get students with mark above 75, call:
// axios.get("http://localhost:5000/studentsAbove/75");
//  This will return all students with mark >= 75
// The response will be a JSON array of student records
// matching the criteria
// Example response:
// [ { "id": 1, "name": "Alice", "email": " 
// "city": "New York", "mark": 85 },
//   { "id": 2, "name": "Bob", "email": " 
// "city": "Los Angeles", "mark":  ninety } ] 
// This endpoint can be used for filtering students
// based on their marks in the frontend application.  

app.get("/studentsFilterByMark/:mark", (req, res) => {
  const { mark } = req.params;
  const sql = "SELECT * FROM student_record WHERE mark >= ?";
  db.query(sql, [mark], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// get students with distinction (mark >= 90)
app.get("/distinctionStudents", (req, res) => {  
  const sql = "SELECT * FROM student_record WHERE mark >= 90";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.get("/studentsAbove/:mark", (req, res) => {
  const { mark } = req.params;
  const sql = "SELECT * FROM student_record WHERE mark >= ?";   
  db.query(sql, [mark], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
}); 



// more endpoints can be added here...

app.listen(5000, () => {
  console.log("server is listening on port 5000...");
});