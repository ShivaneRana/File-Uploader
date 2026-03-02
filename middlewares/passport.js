const localStrategy = require('passport-local');
const bycryptjs = require('bcryptjs');
const db = require('../db/queries');

module.exports.configurePassport = (passport, pool) => {
    passport.use(
        new localStrategy(async (username, password, done) => {
            try {
                const { rows } = await pool.query('SELECT * FROM members WHERE username = $1', [
                    username,
                ]);
                const member = rows[0];

                if (!member) {
                    console.log('Login denied');
                    return done(null, false, { message: 'Incorrect username' });
                }

                const match = await bycryptjs.compare(password, member.password);

                if (!match) {
                    console.log('Login denied');
                    return done(null, false, { message: 'Incorrect password' });
                }

                console.log('login approved');
                return done(null, member);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((member, done) => {
        done(null, member.mid);
    });

    passport.deserializeUser(async (mid, done) => {
        try {
            const member = await db.fetchMember(mid);
            done(null, member);
        } catch (err) {
            done(err);
        }
    });
};
