import User from '../Models/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const { name, type } = req.query;

    let users;
    if (name) {
      users = await User.find({ name }).select('-password -isAdmin');
    } else {
      users = await User.find().select('-password -isAdmin');
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const createSingleUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const createdUser = await user.save();
    res.json(createdUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -isAdmin'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const updateSingleUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password -isAdmin');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const deleteSingleUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};