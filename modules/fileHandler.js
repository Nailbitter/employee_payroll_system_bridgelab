const fs = require("fs").promises;

async function read() {
  try {
    const data = await fs.readFile("employees.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function write(data) {
  try {
    await fs.writeFile("employees.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

module.exports = { read, write };
