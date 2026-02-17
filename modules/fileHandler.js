const fs = require('fs').promises;

async function read() {
    try {
        const data = await fs.readFile('employees.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

module.exports = { read };
