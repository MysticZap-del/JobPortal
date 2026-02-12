const express = require('express');
const app = express();
require('./db/conn')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const RegisterData = require('./models/userData'); // adjust path
const views_path = path.join(__dirname,'../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');
const JWT_SECRET_KEY = 'resume_secret';
const cookie = require('cookie-parser');
const auth = require('./middlewares/auth');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(cookie());



// setting up the view engine
app.set('views', views_path);
app.set('view engine', 'hbs');
hbs.registerPartials(partials_path);




app.get("/", (req, res) => {
    const token = req.cookies.jwt;
    res.render('index', {isLoggedIn: !!token});
});
app.get("/results", (req, res) => {
    const token = req.cookies.jwt;
    res.render('results', {isLoggedIn: !!token});
})
app.get("/login", (req,res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})
app.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
});

app.post("/register", async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords do not match");
        }

        const user = new RegisterData(req.body);
        await user.save();

        res.redirect("/login");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await RegisterData.findOne({ email });

        if (!user) {
            return res.send("Invalid login credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid login credentials");
        }

        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect("/");

    } catch (err) {
        res.status(400).send(err.message);
    }
});



app.post('/upload', auth, (req, res) => {
    try{
        res.redirect('/results');
    }
    catch(err){
        res.send(err);
    }
})


app.listen(PORT, () => {
    console.log(`Server is listening on: http://localhost:${PORT}/`);
})