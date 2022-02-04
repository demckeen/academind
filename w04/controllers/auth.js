const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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',
    }
}));

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    }
    else {message = null;}
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Create Account',
        errorMessage: message
    })
  };

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/signup');}
            
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                });
                return user.save();
            })           
            .then(result => {
                req.flash('success', 'Your account has been successfully created! Please login.');
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'danamckeen@gmail.com',
                    subject: 'Your New Account',
                    html: '<h1>You have successfully created your account!</h1>'
                })
            })
            .catch(err => console.log(err));
});
}

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    }
    else {errorMessage = null;}
    let successMessage = req.flash('success');
    if(successMessage.length > 0) {
        successMessage = successMessage[0];
    }
    else {successMessage = null;}
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errorMessage,
        successMessage: successMessage
    })
  };

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email })
    .then(user => {
      if (!user) { 
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');}
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err);
                    req.flash('success', 'You are now logged in!');
                    res.redirect('/');
                });}
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        })
        .catch(err => console.log(err))
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });    
};