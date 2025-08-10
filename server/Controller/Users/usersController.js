// import { ObjectId } from "mongodb";
import UserModel from "../../Models/usersModel.js";

// const saltRounds = 10;

// const registerUser = async (req, res) => {
//   const { first_name, last_name, email_address, password } = req.body;

//   if (!first_name || !last_name || !email_address || !password) {
//     return res.status(400).send('All fields are required.');
//   }

//   if (password.length < 3) {
//     return res.status(400).send('Password length not suitable.');
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     await sql`INSERT INTO users (first_name, last_name, email_address, password) VALUES (${first_name}, ${last_name}, ${email_address}, ${hashedPassword})`;

//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (err) {
//     console.error('Error during registration:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// const loginUser = async (req, res) => {
//   const { email_address, password } = req.body;

//   if (!email_address || !password) {
//     return res.status(400).send('Email and password are required.');
//   }

//   try {
//     // Retrieve user information
//     const result = await sql`SELECT * FROM users WHERE email_address = ${email_address}`;
//     const user = result[0];

//     if (user) {
//       console.log(`Retrieved user: ${JSON.stringify(user)}`);

//       const isMatch = await bcrypt.compare(password, user.password);
//       console.log(`Password match: ${isMatch}`);

//       if (isMatch) {
//         req.session.user = { first_name: user.first_name, last_name: user.last_name };
//         return res.status(200).json({ message: 'Login successful' });
//       } else {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
//     } else {
//       return res.status(404).send('User not found');
//     }
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };
/**
 * Get all users or search by name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with JSON array of users or an error message
 */
const getAllUsers = async (req, res) => {
  try {
    
    const { name } = req.query;
    let query = {};
    
    if (name) {
      query = {
        $or: [
          { first_name: { $regex: name, $options: 'i' } },
          { last_name: { $regex: name, $options: 'i' } }
        ]
      }
    }
    const users = await UserModel.find(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/**
 * Get a single user by ID
 * @param {Object} req - Express request object with user ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with user object or an error message
 */
const getSingleUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error!", error: error.message });
  }
};

/**
 * Create a new user
 * @param {Object} req - Express request object with user data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with created user object or an error message
 */

const createSingleUser = async (req, res) => {
  try {
    const user = req.body;
    const newUser = new UserModel(user);
    const result = await newUser.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/**
 * Delete a single user by ID
 * @param {Object} req - Express request object with user ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with success message or an error message
 */
const deleteSingleUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server error`, error: error.message });
  }
};

/**
 * Update a single user by ID
 * @param {Object} req - Express request object with user ID in params and update data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with updated user object or an error message
 */
const updateSingleUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server error`, error: error.message });
  }
};

export {
  getAllUsers,
  getSingleUser,
  createSingleUser,
  deleteSingleUser,
  updateSingleUser,
  //   registerUser,
  //   loginUser
};
