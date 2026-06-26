const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const generateToken = require("../helper/jwt");

const home = (req, res) => {
  console.log("hai");
};

const signup = async (req, res) => {
  console.log(req.body);
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password || !phoneNumber) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
  }

  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
    return res.status(400).json({ success: false, message: "Invalid phone number format" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log(existingUser, "llllllllllllllllll");
    return res.status(400).json({ success: false, message: "User already exists" });
  }
  // const a =await bcrypt.hash('Admin@123', 10);
  //   const s = await User.create({
  //   userName: 'Administrator',
  //   email: 'admin@gmail.com',
  //   password: a,
  //   phoneNumber: '000000000',
  //   role:'admin'
  // })

  const newUser = await User.create({
    userName: name,
    email: email,
    password: hashedPassword,
    phoneNumber: phoneNumber,
  });

  console.log(newUser, "new user");

  const jwtToken = generateToken(newUser);

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: newUser._id,
      email: newUser.email,
      userName: newUser.userName,
      role: newUser.role,
    },
  });
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  console.log(existingUser, "oooooooooo");
  console.log("Entered Password:", password);
  console.log("Stored Password:", existingUser.password);

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }

  const jwtToken = generateToken(existingUser);

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: existingUser._id,
      email: existingUser.email,
      userName: existingUser.userName,
      role: existingUser.role,
    },
  });
};

const logout = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const getCurrentUser = async (req, res) => {
  console.log("get user hereeee");

  const user = await User.findById(req.user.userId);

  res.status(200).json({
    success: true,
    user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      userName,
      phoneNumber,
      qualification,
      experience,
      bloodGroup,
      dateOfBirth,
    } = req.body;

    if (!userName || !phoneNumber) {
      return res.status(400).json({ success: false, message: "Name and phone number are required" });
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    // Find user and update. We intentionally exclude email and password here.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          userName,
          phoneNumber,
          qualification,
          experience,
        },
      },
      { new: true, runValidators: true },
    ).select("-password"); // Don't send the password back

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }

    // 1. Get the user WITH their current hashed password
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }

    // 3. Hash the new password and save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  home,
  signup,
  Login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};
