const passport = require('../config/passport')
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');



const { createMover, getAllBookings, updateMover, setCompanyDetails, setServices, getAllServices, update_booking_status } = require('../db/queries');

//  Mover Sign Up
exports.mover_signup_get = asyncHandler(async (req, res) => {
    res.render("mover-sign-up", { errors: []});
});

exports.mover_signup_post = [
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

        //  Create a new Mover Object with escaped and trimmed data
        const mover = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        };

        if (!errors.isEmpty()) {
            //  There are errors. Re-render the form with sanitized values/error messages
            res.render("mover-sign-up", { mover: mover, errors: errors.array() });
        } else {
            //  Data from form is valid
            //  Check if client already exists, then create a new client
            try {
                await createMover(mover);
                //  Send a success response
                res.redirect("/app/mover/login")
            } catch (error) {
                res.status(500).json({ message: 'Error creating Relocator' });
            }
        }
    })
];


//  Mover Log In
exports.mover_login_get = asyncHandler(async (req, res) => {
    res.render("mover-login", {errors: []});
});

exports.mover_login_post = (req, res, next) => {
    passport.authenticate('provider-local', (err, user, info) => {
        if (err) {
            return next(err); // If there's an error, handle it
        }

        if (!user) {
            // Authentication failed, user is not authenticated
            console.log(`Info: ${JSON.stringify(info)} Error: ${err}`); // Log the full `info` object for debugging
            return res.render('mover-login', {
                errors: [info.message], // Pass the error message to the template
            });
        }

        // Log the user in
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect to the dashboard on successful login
            return res.redirect('/app/mover/dashboard/' + user.id);
        });
    })(req, res, next);
};

exports.mover_update_post = asyncHandler(async (req, res) => {
    const mover = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        id: req.body.user_id
    };

    try {
        await updateMover(mover);
        res.redirect("/app/mover/dashboard/" + req.user.id);
    } catch (error) {
        res.status(500).json({ message: `Error Updating Details: ${error}` });
    }
})


//  Mover Log Out
exports.mover_logout = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
});

//  View Account Details
exports.mover_dashboard_get = asyncHandler(async (req, res) => {

    if (!req.user) {
        // If no user is authenticated, redirect to the login page
        return res.redirect('/app/mover/login');
    }

    const user = req.user;

    res.render("mover-dashboard", { user: user });
})

//  Get all Bookings for a particular mover
exports.mover_bookings_get = asyncHandler(async (req, res) => {
    const bookings = await getAllBookings(req.params.id, 'mover');

    res.json(bookings);
});

//  Set Company Details
exports.mover_company_details_post = asyncHandler(async (req, res) => {
    const company = {
        company_name: req.body.company_name,
        company_address: req.body.company_address,
        license_number: req.body.license,
        car_type: req.body.car_type,
        id: req.body.user_id
    };

    try {
        await setCompanyDetails(company);
        res.redirect("/app/mover/dashboard/" + req.user.id);
    } catch (error) {
        res.status(500).json({ message: `Error Setting Company Details: ${error}` });
    }
});

//  Update Relocation Services Offered
exports.mover_services_update_post = asyncHandler(async (req, res) => {
    const service = {
        service_name: req.body.service_name,
        description: req.body.description,
        price: req.body.price,
        service_area: req.body.service_area,
        service_provider_id: req.body.user_id
    };

    try {
        await setServices(service);
        res.redirect("/app/mover/dashboard/" + req.user.id);
    } catch (error) {
        res.status(500).json({ message: `Error Setting Company Details: ${error}` });
    }
});


//  Get all Relocation Services Offered By A Mover
exports.mover_services_get = asyncHandler(async (req, res) => {
    const services = await getAllServices(req.params.id);

    res.json(services);
})

//  Update Booking Status
exports.mover_confirm_booking_post = asyncHandler(async (req, res) => {
    await update_booking_status({ status: 'confirmed', id: req.params.booking_id });

    res.redirect("/app/mover/dashboard/" + req.user.id);
});

exports.mover_complete_booking_post = asyncHandler(async (req, res) => {
    await update_booking_status({ status: 'completed', id: req.params.booking_id });

    res.redirect("/app/mover/dashboard/" + req.user.id);
});

exports.mover_cancel_booking_post = asyncHandler(async (req, res) => {
    await update_booking_status({ status: 'cancelled', id: req.params.booking_id });
    console.log(req.user.user_type);

    if (req.user.user_type === 'client') {
        res.redirect("/app/client/dashboard/" + req.user.id);
    } else {
        res.redirect("/app/mover/dashboard/" + req.user.id);
    }
});