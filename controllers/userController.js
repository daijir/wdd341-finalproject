const User = require('../models/user.js');
const { getAuthenticatedClient, googleCallback } = require('../oauth/googleClient.js');

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    let users;
    if (req.query.email) {
      users = await User.find({ email: req.query.email });
    } else {
      users = await User.find();
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST a new user
exports.createUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'user',
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT to update a user
exports.updateUser = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true });

    if (updatedUser == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (deletedUser == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAuthenticated = async function(req, res, next) {
    try {
        await getAuthenticatedClient(req, res);
        next();
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: err.message });
    }
}

exports.sendAuthUrl = async function(req, res, next) {
    try {
        await googleCallback(req, res);
        next();
    } catch (error) {
        console.error('Error sending auth URL:', error);
        res.status(500).json({ message: err.message });
    }
}

exports.logoutUser = async function(req, res) {
    try {
        if (req.session) {
            req.session.destroy((error) => {
                if (error) {
                    console.error('Error destroying session:', error);
                    return res.status(500).render('main', {
                        title: 'Error',
                        user: req.session.user
                    });
                } else {
                    console.log('Session destroyed successfully');
                    // Clear the session cookie
                    res.clearCookie('session');
                    res.redirect('/');
                }
            });
        }
    } catch (error) {
        console.error('Error logging out user:', error);
        return res.status(500).render('main', {
            title: 'Error',
            user: req.session.user
        });
    }
}

// Middleware to check if the user has admin role
exports.checkUserRole = async function(req, res, next) {

  try {
    const user = await User.findOne({ email: req.session.user.email });
    const userRole = user.role;
    console.log('User role:', userRole);
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    } else if (userRole === 'admin') {
      console.log('User has admin role');
      next();
    }
  } catch (error) {
    return res.status(500).json({ message: 'A session is required, please log in using /google' });
  }
}

exports.checkSession = async function(req, res, next) {
  try {
    if (req.session && req.session.isAuthenticated) {
      console.log('User is authenticated');
      next();
    } else {
      return res.status(401).json({ message: 'Authentication required, please log in using /google' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'A session is required, please log in using /google' });
  }
}
