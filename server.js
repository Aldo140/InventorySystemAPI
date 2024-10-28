const express = require('express');
const app = express();
const mysql = require('mysql2');

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies (like forms)

// Database connection
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aldito14', // Replace with your MySQL root password
    database: 'inventory_system'
});

// Home endpoint to confirm successful connection
app.get('/', (req, res) => {
    res.status(200).send(`
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 20px;
            }
            h1, h2 {
                color: #2c3e50;
            }
            h3 {
                color: #e74c3c; /* Color for the author title */
            }
            a {
                text-decoration: none;
                color: #fff;
                padding: 10px 15px;
                border-radius: 5px;
                margin-right: 10px;
                display: inline-block;
            }
            .button-view-items {
                background-color: #3498db;
            }
            .button-view-suppliers {
                background-color: #2ecc71;
            }
            .button-delete-all {
                background-color: #e74c3c;
            }
            form {
                margin: 20px 0;
                padding: 10px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            input {
                margin: 5px 0;
                padding: 10px;
                width: calc(100% - 22px);
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            button {
                padding: 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                background-color: #3498db;
                color: white;
            }
            button:hover {
                background-color: #2980b9;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ccc;
                text-align: left;
            }
            th {
                background-color: #3498db;
                color: white;
            }
            footer {
                margin-top: 30px;
                text-align: center;
            }
            .linkedin-button {
                background-color: #0077b5;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                display: inline-block;
            }
            .linkedin-button:hover {
                background-color: #005582;
            }
        </style>
        <h1>Welcome to the Inventory System API</h1>
        <p>You've successfully connected to the inventory system. Here’s how to use the application:</p>
        
        <h2>Available Actions</h2>
        <p>You can perform the following actions:</p>
        <ul>
            <li><strong>View All Items:</strong> Click the button below to see all inventory items.</li>
            <li><strong>View All Suppliers:</strong> Click the button below to see all suppliers.</li>
            <li><strong>Add New Item:</strong> Fill out the form to add a new item to your inventory.</li>
            <li><strong>Delete Item:</strong> Enter the Item ID and click the button to delete an item.</li>
            <li><strong>Delete All Items and Suppliers:</strong> This is an <em>Operation Armageddon</em> — use with caution.</li>
            <li><strong>Search Item:</strong> Use the form below to search for an item by name.</li>
        </ul>

        <h2>Actions</h2>
        <div>
            <a class="button-view-items" href="/api/items">View All Items</a>
            <a class="button-view-suppliers" href="/api/suppliers">View All Suppliers</a>
        </div>

        <h2>Add New Item</h2>
        <form id="add-item-form">
            <input type="text" name="name" placeholder="Item Name" required>
            <input type="number" name="quantity" placeholder="Quantity" required>
            <input type="number" name="price" placeholder="Price" step="0.01" required>
            <input type="number" name="supplier_id" placeholder="Supplier ID" required>
            <button type="submit">Add Item</button>
        </form>

        <h2>Delete Item</h2>
        <form id="delete-item-form">
            <input type="number" name="id" placeholder="Item ID to delete" required>
            <button type="submit">Delete Item</button>
        </form>

        <h2>Operation Armageddon</h2>
        <p>Delete All Items and Suppliers:</p>
        <button id="delete-all-button" class="button-delete-all">Delete All</button>

        <h2>Search for an Item</h2>
        <form id="search-item-form">
            <input type="text" name="search" placeholder="Item Name to search" required>
            <button type="submit">Search</button>
        </form>
        <div id="search-results"></div>

        <h2>cURL Commands Legend</h2>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>cURL Command</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>View all items</td>
                    <td><code>curl -X GET http://localhost:3000/api/items</code></td>
                </tr>
                <tr>
                    <td>View all suppliers</td>
                    <td><code>curl -X GET http://localhost:3000/api/suppliers</code></td>
                </tr>
                <tr>
                    <td>Add a new item</td>
                    <td><code>curl -X POST http://localhost:3000/api/items/add -H "Content-Type: application/json" -d '{"name": "ItemName", "quantity": 10, "price": 29.99, "supplier_id": 1}'</code></td>
                </tr>
                <tr>
                    <td>Delete an item by ID</td>
                    <td><code>curl -X DELETE http://localhost:3000/api/items/delete/1</code></td>
                </tr>
                <tr>
                    <td>Delete all items</td>
                    <td><code>curl -X DELETE http://localhost:3000/api/items/delete-all</code></td>
                </tr>
                <tr>
                    <td>Delete all suppliers</td>
                    <td><code>curl -X DELETE http://localhost:3000/api/suppliers/delete-all</code></td>
                </tr>
            </tbody>
        </table>

        <h3 style="font-size: 2em; color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">Meet the Author: Aldo Ortiz</h3>
        <p style="font-size: 1.2em; color: #555; line-height: 1.6;">
        With a Bachelor's degree in Computer Information Systems, Aldo Ortiz is passionate about leveraging technology to create impactful solutions. 
        A dedicated learner and aspiring data analyst, Aldo thrives on turning complex problems into elegant solutions. 
        When he's not coding, you can find him exploring new ideas, engaging with fellow tech enthusiasts, or enjoying the latest video game.
        </p>
        <p style="font-size: 1.2em; color: #555;">
        Connect with Aldo and join him on his journey to innovate and inspire in the tech world!
        </p>
        <a class="linkedin-button" href="https://www.linkedin.com/in/aldo-ortiz14" target="_blank" style="background-color: #0077b5; padding: 12px 20px; font-size: 1em; border-radius: 5px; transition: background-color 0.3s;">Let's Connect on LinkedIn</a>


        <footer>
            <p>If you have any questions, feel free to ask!</p>
        </footer>

        <script>
            document.getElementById('add-item-form').addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                fetch('/api/items/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => alert('Item added: ' + JSON.stringify(data)))
                .catch(error => alert('Error adding item: ' + error));
            });

            document.getElementById('delete-item-form').addEventListener('submit', function(event) {
                event.preventDefault();
                const itemId = this.elements.id.value;

                fetch('/api/items/delete/' + itemId, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.status === 204) {
                        alert('Item deleted successfully');
                    } else {
                        return response.json().then(data => { throw new Error(data.message); });
                    }
                })
                .catch(error => alert('Error deleting item: ' + error.message));
            });

            document.getElementById('delete-all-button').addEventListener('click', function() {
                const confirmDelete = window.confirm("Are you sure you want to delete all items and suppliers?");

                if (confirmDelete) {
                    deleteAllData();
                }
            });

            const deleteAllData = async () => {
                try {
                    const response = await fetch('/api/items/delete-all', { method: 'DELETE' });
                    const supplierResponse = await fetch('/api/suppliers/delete-all', { method: 'DELETE' });

                    if (response.ok && supplierResponse.ok) {
                        alert('All items and suppliers have been deleted.');
                    } else {
                        alert('Failed to delete data.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            document.getElementById('search-item-form').addEventListener('submit', function(event) {
                event.preventDefault();
                const searchQuery = this.elements.search.value;

                fetch('/api/items/search?name=' + encodeURIComponent(searchQuery), {
                    method: 'GET',
                })
                .then(response => response.json())
                .then(data => {
                    const resultsDiv = document.getElementById('search-results');
                    resultsDiv.innerHTML = '';
                    if (data.length > 0) {
                        data.forEach(item => {
                            resultsDiv.innerHTML += \`<div>Item: \${item.name}, Quantity: \${item.quantity}, Price: \${item.price}, Supplier ID: \${item.supplier_id}</div>\`;
                        });
                    } else {
                        resultsDiv.innerHTML = '<div>No items found.</div>';
                    }
                })
                .catch(error => alert('Error searching for items: ' + error));
            });
        </script>
    `);
});


// API Endpoint: View all items
app.get('/api/items', (req, res) => {
    database.query('SELECT * FROM Item', (error, results) => {
        if (error) throw error;
        res.status(200).json(results);
    });
});

// Endpoint to search for an item by name
app.get('/api/items/search', (req, res) => {
    const name = req.query.name;
    console.log(`Searching for items with name: ${name}`); // Debugging log
    const sql = 'SELECT * FROM Item WHERE name LIKE ?'; // Ensure table name matches your DB
    database.query(sql, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('Database query error:', err); // Debugging log
            return res.status(500).json({ error: 'Database query error' });
        }
        console.log('Search results:', results); // Debugging log
        res.json(results);
    });
});


// API Endpoint: View all suppliers
app.get('/api/suppliers', (req, res) => {
    database.query('SELECT * FROM Supplier', (error, results) => {
        if (error) throw error;
        res.status(200).json(results);
    });
});

// API Endpoint: Add new item
app.post('/api/items/add', (req, res) => {
    const { name, quantity, price, supplier_id } = req.body;

    if (!name || !quantity || !price || !supplier_id) {
        return res.status(400).json({ message: "All fields are required." });
    }

    database.query('SELECT * FROM Supplier WHERE id = ?', [supplier_id], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).json({ message: `Supplier with ID ${supplier_id} not found.` });
        }

        database.query('INSERT INTO Item (name, quantity, price, supplier_id) VALUES (?, ?, ?, ?)', [name, quantity, price, supplier_id], (error, results) => {
            if (error) throw error; // Ensure no errors during insertion
            res.status(201).json({ id: results.insertId, name, quantity, price, supplier_id });
        });
    });
});

// API Endpoint: Delete an item by ID
app.delete('/api/items/delete/:id', (req, res) => {
    const itemId = req.params.id;

    database.query('DELETE FROM Item WHERE id = ?', [itemId], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: `Item with ID ${itemId} not found.` });
        }
        res.status(204).send(); // No content to send back for successful deletion
    });
});

// API Endpoint: Delete all items
app.delete('/api/items/delete-all', (req, res) => {
    database.query('DELETE FROM Item', (error, results) => {
        if (error) throw error;
        res.status(204).send(); // No content to send back for successful deletion
    });
});

// API Endpoint: Delete all suppliers
app.delete('/api/suppliers/delete-all', (req, res) => {
    database.query('DELETE FROM Supplier', (error, results) => {
        if (error) throw error;
        res.status(204).send(); // No content to send back for successful deletion
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
