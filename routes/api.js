const express = require('express');

const router = express.Router();

///**  CLIENT ROUTES  **///
const clientController = require('../controllers/clientController');
const moverController = require('../controllers/moverController');

//  Home
router.get('/', (req, res) => {
    res.render('index');
});

//  Client Sign Up
router.get('/client/signup', clientController.client_signup_get);

router.post('/client/signup', clientController.client_signup_post);

//  Client Log In
router.get('/client/login', clientController.client_login_get);

router.post('/client/login', clientController.client_login_post);

router.post('/client/update/:id', clientController.client_update_post);

//  Client Log Out
router.get('/client/logout', clientController.client_logout);

//  Client Dashboard
router.get('/client/dashboard/:id', clientController.client_dashboard_get);

//  View Relocation Service Providers
router.get('/client/providers', clientController.client_service_providers_get);


//  Get all client bookings
router.get('/client/:id/bookings', clientController.client_bookings_get);


//  Get A single Booking
router.get('/client/:client_id/bookings/:booking_id', clientController.client_booking_get);

//  Get form to Book a Relocation Service Provider
router.get('/client/:client_id/booking/:provider_id', clientController.client_book_get);

//  Book a Relocation Service Provider
router.post('/client/:client_id/booking/:provider_id', clientController.client_book_post);

//  Cancel a Booking
router.post('/client/:client_id/cancel/:booking_id', clientController.client_cancel_booking_post);

//  Rating a Service Provider
router.post('/client/:client_id/rate/:provider_id', clientController.client_rate_provider_post);


/// MOVER ROUTES  ///

//  Mover Sign Up
router.get('/mover/signup', moverController.mover_signup_get);

router.post('/mover/signup', moverController.mover_signup_post);

//  Mover Log In
router.get('/mover/login', moverController.mover_login_get);

router.post('/mover/login', moverController.mover_login_post);

//  Mover Dashboard
router.get('/mover/dashboard/:id', moverController.mover_dashboard_get);

//  Mover Logout
router.get('/mover/logout', moverController.mover_logout);

//  Get all Bookings for a particular mover
router.get('/mover/:id/bookings', moverController.mover_bookings_get);

//  Update a Mover's Details
router.post('/mover/update/:id', moverController.mover_update_post);

//  Update Company Details
router.post('/mover/company/update/:id', moverController.mover_company_details_post);



//  Get all Relocation Services Offered By A Mover
router.get('/mover/services/:id', moverController.mover_services_get);

//  Update Relocation Services Offered
router.post('/mover/services/update/:id', moverController.mover_services_update_post);

//  Confirm a Booking
router.post('/mover/:mover_id/confirm/:booking_id', moverController.mover_confirm_booking_post);

//  Mark a Booking as Completed
router.post('/mover/complete/:booking_id', moverController.mover_complete_booking_post);


//  Cancel a Booking
router.post('/cancel/:booking_id', moverController.mover_cancel_booking_post);


//  Export Router
module.exports = router;