const validator = require("validator");
const bcrypt = require("bcrypt");



const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    // Validate password strength (minimum 8 characters, at least one number and one letter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters long and contain at least one letter and one number");
    }

    // Validate name fields (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        throw new Error("First name and last name should only contain letters and spaces");
    }

    return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password
    };
};

const validateEditprofile = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "skills",
    "age",
    "gender",
    "about",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid fields in profile update");
  }
  return req.body;
};

module.exports = { validateSignUpData, validateEditprofile };