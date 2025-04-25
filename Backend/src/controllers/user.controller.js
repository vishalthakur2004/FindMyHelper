import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { BlacklistRefreshToken } from "../models/blacklistedRefreshToken.model.js";
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.js";
import { sendOtp } from "../utils/sendOtp.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const checkAvailability = async (req, res) => {
    const { email, phoneNumber } = req.body;
  
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
  
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone already in use' });
    }
  
    return res.status(200).json({ message: 'Available' });
};

export const sendOtpToPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    await sendOtp(phone); // Twilio sends OTP to the phone number

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const registerUser = async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone and OTP are required" });
      }

      // Use Twilio to verify the OTP
      const verified = await sendOtp(phoneNumber, otp, true); // 'true' indicates verification mode

      if (!verified) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      const {
        fullName,
        email,
        password,
        role,
        profession,
        address,
        availabilityTimes,
      } = req.body;

      if(!role){
        return res.status(400).json({ message: 'Role is required' });
      }
      if(role === 'worker') {
        if(!fullName || !email || !password || !role || !profession || !address || !availabilityTimes) {
          return res.status(400).json({ message: 'All fields are required' });
        }
      }
      else if(!fullName || !email || !password || !role || !address) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const photoPath = req.file ? req.file.path : null;    
      if (!photoPath && role === 'worker') {
        return res.status(400).json({ message: 'Photo is required' });
      }

      let photo = null;
      if(photoPath) {
        const result = await uploadCloudinary(photoPath);
        photo = result.url;
      }

      if(role === 'worker') {
        if(!photo) {
          return res.status(400).json({ message: 'Failed to upload profile photo' });
        }
      }
  
      const user = await User.create({
        fullName,
        email,
        password,
        role,
        phoneNumber,
        profession,
        photo,
        address,
        availabilityTimes
      });
  
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: 'Registration successful',
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profession: user.profession,
        },
        accessToken
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: 'Something went wrong' });
    }
};

export const loginUser = async (req, res) => {
    try {
      const { phoneNumber, email, password } = req.body;

      if (!phoneNumber && !email) {
        return res.status(400).json({ message: 'Phone or email is required' });
      }
  
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
  
      const user = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });
  
      if (!user || !(await user.isPasswordCorrect(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });     
  
      res.status(200).json({
        message: 'Login successful',
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          profession: user.profession,
        },
        accessToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: 'Something went wrong' });
    }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'No refresh token found in cookies' });
    }
    
    const blacklisted = await BlacklistRefreshToken.findOne({ token: refreshToken });
    if (blacklisted) {
      return res.status(400).json({ message: 'Token is already blacklisted' });
    }

    await BlacklistRefreshToken.create({ refreshToken });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const blacklisted = await BlacklistRefreshToken.findOne({ token: refreshToken });
    if (blacklisted) {
      return res.status(403).json({ message: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = await user.generateAccessToken();

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      email,
      address,
      profession,
      availabilityTimes,
    } = req.body;

    const updatedFields = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(address && { address }),
      ...(profession && { profession }),
      ...(availabilityTimes && { availabilityTimes }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    res.status(200).json({ message: 'Account updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Update account error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    const imagePath = req.file.path;

    if (!imagePath) {
      return res.status(400).json({ message: 'Profile photo is required' });
    }

    const image = await uploadCloudinary(imagePath);

    if(!image.url) {
      return res.status(400).json({ message: 'Failed to upload profile photo' });
    }

    if(req.user.photo) {
      try {
        await deleteCloudinary(req.user.photo);
      } catch (error) {
        console.log(error.message);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set: {
              photo: image.url
          }
      },
      {new: true} 
    ).select("-password -refreshToken");

    res.status(200).json({
      message: 'Profile photo updated successfully',
      user,
    });
  } catch (error) {
    console.error("Update profile photo error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let reviews = [];
    let avgRating = 0;

    if (user.role === 'worker') {
      const reviewData = await Review.aggregate([
        { $match: { workerId: new mongoose.Types.ObjectId(user._id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer'
          }
        },
        { $unwind: '$customer' },
        {
          $project: {
            _id: 1,
            rating: 1,
            comment: 1,
            createdAt: 1,
            customer: {
              _id: '$customer._id',
              fullName: '$customer.fullName',
              photo: '$customer.photo'
            }
          }
        }
      ]);

      reviews = reviewData;
      if (reviewData.length > 0) {
        avgRating =
          reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length;
      }
    }

    res.status(200).json({
      user,
      reviews,
      avgRating: parseFloat(avgRating.toFixed(2))
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;

    if(!workerId) {
      return res.status(400).json({ message: 'Worker ID is required' });
    }

    let objectId;

    try {
      objectId = new mongoose.Types.ObjectId(String(workerId));
    } catch (error) {
      throw new ApiError(400, "Invalid worker ID");
    }

    const pipeline = [
      { $match: { _id: objectId, role: 'worker' } },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'workerId',
          as: 'reviews'
        }
      },
      {
        $unwind: {
          path: '$reviews',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reviews.customerId',
          foreignField: '_id',
          as: 'reviews.customer'
        }
      },
      {
        $unwind: {
          path: '$reviews.customer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          fullName: { $first: '$fullName' },
          profession: { $first: '$profession' },
          photo: { $first: '$photo' },
          address: { $first: '$address' },
          availabilityTimes: { $first: '$availabilityTimes' },
          location: { $first: '$location' },
          bookingsAday: { $first: '$bookingsAday' },
          reviews: {
            $push: {
              _id: '$reviews._id',
              rating: '$reviews.rating',
              comment: '$reviews.comment',
              customer: {
                _id: '$reviews.customer._id',
                fullName: '$reviews.customer.fullName',
                photo: '$reviews.customer.photo'
              }
            }
          },
          avgRating: { $avg: '$reviews.rating' }
        }
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          profession: 1,
          photo: 1,
          address: 1,
          availabilityTimes: 1,
          location: 1,
          bookingsAday: 1,
          reviews: {
            $filter: {
              input: '$reviews',
              as: 'review',
              cond: { $ne: ['$$review._id', null] }
            }
          },
          avgRating: { $ifNull: ['$avgRating', 0] }
        }
      }
    ];

    const result = await User.aggregate(pipeline);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

