import User from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      //res.json({ token });
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const user = new User(req.body);
    const createdUser = await user.save();
    console.log(createdUser);

    const token = generateToken(createdUser);
    // res.status(201).json({ token });
    res.status(201).json({ message: 'First time login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const logout = (req, res) => {
  // In a JWT-based auth system, you typically handle logout on the client side by removing the token
  res.status(200).json({ message: 'Logout successful' });
};