// import { ObjectId } from "mongodb";
import HealthStat from "../Models/healthStatsModel.js";

/**
 * Get all healthStats or search by name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with JSON array of healthStats or an error message
 */
const getAllStats = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};

    if (name) {
      query = {
        $or: [
          { first_name: { $regex: name, $options: "i" } },
          { last_name: { $regex: name, $options: "i" } },
        ],
      };
    }
    const healthStats = await HealthStat.find(query);
    res.status(200).json(healthStats);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/**
 * Get a single healthStat by ID
 * @param {Object} req - Express request object with healthStat ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with healthStat object or an error message
 */
const getSingleStat = async (req, res) => {
  try {
    const healthStat = await HealthStat.findById(req.params.id);
    if (!healthStat) {
      return res.status(400).json({ message: "health statistic not found!" });
    }
    res.json(healthStat);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error!", error: error.message });
  }
};

/**
 * Create a new healthStat
 * @param {Object} req - Express request object with healthStat data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with created healthStat object or an error message
 */

const createSingleStat = async (req, res) => {
  try {
    const healthStat = req.body;
    const newhealthStat = new HealthStat(healthStat);
    const result = await newhealthStat.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/**
 * Delete a single healthStat by ID
 * @param {Object} req - Express request object with healthStat ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with success message or an error message
 */
const deleteSingleStat = async (req, res) => {
  try {
    const healthStat = await HealthStat.findByIdAndDelete(req.params.id);
    if (!healthStat) {
      res.status(404).json({ message: "health statistic not found!" });
    }
    res.json(healthStat);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server error`, error: error.message });
  }
};

/**
 * Update a single healthStat by ID
 * @param {Object} req - Express request object with healthStat ID in params and update data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with updated healthStat object or an error message
 */
const updateSingleStat = async (req, res) => {
  try {
    const healthStat = await HealthStat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!healthStat) {
      return res.status(404).json({ message: "healthStat not found!" });
    }
    res.json({ message: "health statistic deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server error`, error: error.message });
  }
};

export {
  getAllStats,
  getSingleStat,
  createSingleStat,
  deleteSingleStat,
  updateSingleStat,
};
