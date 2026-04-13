import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: "qf5dic2wzyjf1x5x.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: "i48m7y1xfdjc232w",
    connectionLimit: 10,
    waitForConnections: true
});



app.get('/', async (req, res) => {
    const authorsSql = `SELECT authorId, firstName, lastName
                       FROM authors
                       ORDER BY lastName`;

    const categoriesSql = `SELECT DISTINCT category
                          FROM quotes
                          ORDER BY category`;

    const [authors] = await pool.query(authorsSql);
    const [categories] = await pool.query(categoriesSql);
    res.render('home.ejs', { authors, categories });
});


app.get('/searchByAuthor', async (req, res) => {
    let authorId = req.query.authorId;
    let sql = `SELECT quote, firstName, lastName, authors.authorId
              FROM quotes
              NATURAL JOIN authors
              WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
    res.render('quotes.ejs', { rows })
});

app.get("/searchByKeyword", async (req, res) => {
    try {
        //console.log(req);
        let keyword = req.query.keyword;
        let sql = `SELECT quote, firstName, lastName, authorId
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE quote LIKE ? `;
        let sqlParams = [`%${keyword}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotes.ejs", { rows });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.get("/searchByCategory", async (req, res) => {
    try {
        let category = req.query.category;
        let sql = `SELECT quote, firstName, lastName, authors.authorId
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE category = ?`;
        const [rows] = await pool.query(sql, [category]);
        console.log(rows);
        res.render('quotes.ejs', { rows });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});

app.get("/searchByLikes", async (req, res) => {
    try {
        let range = req.query.likesRange;
        if (!range) return res.status(400).send("Choose a likes range.");
        let minLikes = range.split("-")[0];
        let maxLikes = range.split("-")[1];
        let sql = `SELECT quote, firstName, lastName, authors.authorId
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE likes >= ? AND likes <= ?`;
        let sqlParams = [parseInt(minLikes), parseInt(maxLikes)];
        const [rows] = await pool.query(sql, sqlParams);
        res.render("quotes.ejs", { rows });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});


app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get('/api/author/:author_Id', async (req, res) => {
    console.log(req);
    let authorId = req.params.author_Id;
    let sql = `SELECT * 
              FROM authors
              Where authorId = ?`;
    const [authorinfo] = await pool.query(sql, [authorId]);
    res.send(authorinfo);

});


app.listen(3000, () => {
    console.log("Express server running")
})