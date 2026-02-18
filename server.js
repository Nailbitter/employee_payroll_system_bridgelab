const express = require("express");
const app = express();
const fileHandler = require("./modules/fileHandler");

/* ================= MIDDLEWARE ================= */

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static CSS
app.use(express.static("public"));

// Set EJS
app.set("view engine", "ejs");

// Request Logger (Professional touch)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


/* ================= DASHBOARD ================= */

app.get("/", async (req, res) => {
  try {
    const employees = await fileHandler.read();
    res.render("index", { employees });
  } catch (error) {
    console.error(error);
    res.send("Error loading dashboard");
  }
});


/* ================= ADD EMPLOYEE ================= */

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  try {
    const { name, department, salary } = req.body;

    // Validation
    if (!name || !department || Number(salary) <= 0) {
      return res.send("Invalid input. Name required & salary must be positive.");
    }

    const employees = await fileHandler.read();

    const newEmployee = {
      id: Date.now(),
      name,
      department,
      salary: Number(salary)
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send("Error adding employee");
  }
});


/* ================= DELETE EMPLOYEE ================= */

app.get("/delete/:id", async (req, res) => {
  try {
    const employees = await fileHandler.read();

    const filtered = employees.filter(emp => emp.id != req.params.id);

    await fileHandler.write(filtered);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send("Error deleting employee");
  }
});


/* ================= EDIT EMPLOYEE ================= */

app.get("/edit/:id", async (req, res) => {
  try {
    const employees = await fileHandler.read();
    const employee = employees.find(emp => emp.id == req.params.id);

    // Prevent crash if invalid ID
    if (!employee) {
      return res.redirect("/");
    }

    res.render("edit", { employee });
  } catch (error) {
    console.error(error);
    res.send("Error loading edit page");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { name, department, salary } = req.body;

    // Validation
    if (!name || !department || Number(salary) <= 0) {
      return res.send("Invalid input. Name required & salary must be positive.");
    }

    const employees = await fileHandler.read();

    const updatedEmployees = employees.map(emp => {
      if (emp.id == req.params.id) {
        return {
          ...emp,
          name,
          department,
          salary: Number(salary)
        };
      }
      return emp;
    });

    await fileHandler.write(updatedEmployees);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send("Error updating employee");
  }
});


/* ================= SERVER ================= */

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
