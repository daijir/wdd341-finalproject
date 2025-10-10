const dotenv = require('dotenv');
const { google } = require('googleapis');

//import { getDb } from '../mongodb/connection.js';
const User = require('../models/user.js');

dotenv.config();

// The scope for reading contacts.
const SCOPES = ['profile', 'email'];
const c_id = process.env.GOOGLE_CLIENT_ID
const c_secret = process.env.GOOGLE_CLIENT_SECRET
const redirect_url = process.env.GOOGLE_OAUTH_REDIRECT_URL; // Path to OAuth 2.0

// Authenticate with Google and get an authorized client.
  const oauth2Client = new google.auth.OAuth2(
  c_id,
  c_secret,
  redirect_url
);

/*
  * Redirect the user to Google's OAuth 2.0 server to initiate the authentication and authorization process.
*/
async function getAuthenticatedClient(req, res) {
  try {
    const authUrl = await oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).send('Authentication failed');
  }
}

/*
  * Handle the OAuth 2.0 server response and create a user in the database if they don't already exist.
*/
async function googleCallback(req, res) {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user information.
    const oauth2 = google.oauth2({version: 'v2', auth: oauth2Client});
    const user = await oauth2.userinfo.get();
    const { email, given_name, family_name } = user.data;
    console.log('User signed in');

    // Set session variables.
    req.session.user = {
      email,
      given_name,
      family_name
    };
    req.session.isAuthenticated = true;

    // Check if the user already exists in the database.
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const user = new User({
        name: `${given_name} ${family_name}`,
        email: email,
        role: 'user', // Default role
      });
      const newUser = await user.save();
      console.log('User created:', newUser);
      res.redirect('/');
    } else {
      console.log('User already exists.');
      res.redirect('/');
    } 
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    res.status(500).send('Authentication failed');
  }
}

module.exports = { getAuthenticatedClient, googleCallback };