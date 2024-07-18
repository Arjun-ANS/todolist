import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  host: "localhost",
  password: "arjunlegend",
  user: "postgres",
  database: "permalist",
  port: 5432,
})

db.connect();
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result =  await db.query('select * from todolist');
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query('insert into todolist (id,title) values (default,$1)',[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemtitle = req.body.updatedItemTitle;
  await db.query('update todolist set title = $1 where id = $2',[itemtitle,itemId]);
  res.redirect("/");
});

app.post("/delete",async (req, res) => {
  const itemId = req.body.deleteItemId;
  await db.query('delete from todolist where id = $1',[itemId]);
  res.redirect("/");
});
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
