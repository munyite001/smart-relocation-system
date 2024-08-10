/**
 * Client Functionality
 * 
 * Functionality for the client entity
 * 
 * 1. Sign Up for a new account
 * 2. Log In to an existing account
 * 3. Log Out of an account
 * 4. View account details
 * 5. View a list of all relocation service providers in a specific location
 * 6. Book a relocation service provider
 * 7. Cancel a booking
 * 8. View a list of all bookings
 * 9. Rate a relocation service provider
 */

const passport = require('../config/passport')
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');


const { createClient, updateClient, getAllMovers, getAllBookings, getSingleMover, create_booking } = require('../db/queries');

//  Client Sign Up
exports.client_signup_get = asyncHandler(async (req, res) => {
    res.render("client-sign-up", { errors: []});
});

exports.client_signup_post = [
    //  Validate and sanitize fields
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('phone').trim().isMobilePhone().withMessage('Invalid phone number'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    //  Process request after validation and sanitization
    asyncHandler(async (req, res) => {
        //  Extract the validation errors from a request
        const errors = validationResult(req);

        //  Create a new Client Object with escaped and trimmed data
        const client = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        };

        if (!errors.isEmpty()) {
            //  There are errors. Re-render the form with sanitized values/error messages
            res.render("client-sign-up", { client: client, errors: errors.array() });
        } else {
            //  Data from form is valid
            //  Check if client already exists, then create a new client
            try {
                await createClient(client);
                //  Send a success response
                res.redirect("/app/client/login")
            } catch (error) {
                res.status(500).json({ message: 'Error creating client' });
            }
        }
    })
];


//  Client Log In
exports.client_login_get = asyncHandler(async (req, res) => {
    res.render("client-login", {errors: []});
});

exports.client_login_post = (req, res, next) => {
    passport.authenticate('client-local', (err, user, info) => {
        if (err) {
            return next(err); // If there's an error, handle it
        }

        if (!user) {
            // Authentication failed, user is not authenticated
            console.log(`Info: ${JSON.stringify(info)} Error: ${err}`); // Log the full `info` object for debugging
            return res.render('client-login', {
                errors: [info.message], // Pass the error message to the template
            });
        }

        // Log the user in
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect to the dashboard on successful login
            return res.redirect('/app/client/dashboard/' + user.id);
        });
    })(req, res, next);
};

exports.client_update_post = asyncHandler(async (req, res) => {
    const client = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        id: req.body.user_id
    };

    try {
        await updateClient(client);
        res.redirect("/app/client/dashboard/" + req.user.id);
    } catch (error) {
        res.status(500).json({ message: `Error Updating Clients: ${error}` });
    }
})


//  Client Log Out
exports.client_logout = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
});

//  View Account Details
exports.client_dashboard_get = asyncHandler(async (req, res) => {

    if (!req.user) {
        // If no user is authenticated, redirect to the login page
        return res.redirect('/app/client/login');
    }

    const user = req.user;

    res.render("client-dashboard", { user: user });
})

//  View Relocation Service Providers
exports.client_service_providers_get = asyncHandler(async (req, res) => {
    const serviceProviders = await getAllMovers();

    res.json(serviceProviders);
})


exports.client_bookings_get = asyncHandler(async (req, res) => {
    const bookings = await getAllBookings(req.params.id, 'client');
    console.log(bookings);
    res.json(bookings);
});

//  Book a Relocation Service Provider
exports.client_booking_get = asyncHandler(async (req, res) => {
    res.send("Display booking form");
});


//  Display the booking form
exports.client_book_get = asyncHandler(async (req, res) => {
    
    const client_id = req.params.client_id;
    const provider_id = req.params.provider_id;
    
    console.log("Provider ID: ", provider_id);
    console.log("Client ID: ", client_id);
    
    const mover = await getSingleMover(provider_id);
    console.log(mover);
    
    res.render('booking-form', { client_id: req.params.client_id, mover: mover });
})


exports.client_book_post = asyncHandler(async (req, res) => {
    const booking = {
        client_id: req.params.client_id,
        provider_id: req.params.provider_id,
        relocation_date: req.body.date,
        time: req.body.time,
        from_location: req.body.from_location,
        to_location: req.body.to_location,
        service_name: req.body.service
    }

    try {
        await create_booking(booking);
        res.redirect("/app/client/dashboard/" + req.params.client_id);
    } catch (error) {
        res.status(500).json({ message: `Error creating booking: ${error}` });
    }

})



//  Cancel a Booking
exports.client_cancel_booking_get = asyncHandler(async (req, res) => {
    res.send("Display cancel booking form");
});

exports.client_cancel_booking_post = asyncHandler(async (req, res) => {
    res.send("Process cancel booking");
})

exports.client_rate_provider_get = asyncHandler(async (req, res) => {
    res.send("Display rate provider form");
})

exports.client_rate_provider_post = asyncHandler(async (req, res) => {
    res.send("Process rate service provider");
})