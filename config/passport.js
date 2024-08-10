require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

// Strategy for Clients
passport.use(
    'client-local',
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'User with that email does not exist' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Strategy for Service Providers
passport.use(
    'provider-local',
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM service_providers WHERE email = $1', [email]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'User with that email does not exist' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    // Avoid referencing user.type directly during destructuring
    done(null, { id: user.id, type: user.user_type });
});

passport.deserializeUser(async (user, done) => {
    try {
        let query;
        if (user.type === 'client') {
            query = 'SELECT * FROM clients WHERE id = $1';
        } else if (user.type === 'mover') {
            query = 'SELECT * FROM service_providers WHERE id = $1';
        }

        const { rows } = await pool.query(query, [user.id]);
        const userData = rows[0];
        done(null, userData);
    } catch (err) {
        return done(err);
    }
});

module.exports = passport;
