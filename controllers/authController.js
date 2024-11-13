const users = [];

exports.registerPage = (req, res) => {
    res.render('register', { message: null });
};

exports.register = (req, res) => {
    const { email, password } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.render('register', { message: 'User already exists' });
    }

    users.push({ email, password });
    res.redirect('/login');
};

exports.loginPage = (req, res) => {
    res.render('login', { message: null });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.render('login', { message: 'Invalid email or password' });
    }

    req.session.user = user;
    res.redirect('/dashboard');
};



