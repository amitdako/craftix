const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter email."],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters long"],
      validate(value) {
        // Complexity check: Must contain at least one uppercase and one lowercase letter
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
          throw new Error(
            "Password must contain both uppercase and lowercase English letters",
          );
        }
      },
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      validate(value) {
        if (!value.includes(" ")) {
          throw new Error("Please provide both first and last name");
        }
      },
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [20, "Display name cannot exceed 20 characters"],
    },
    birthDate: {
      type: Date,
      required: [true, "Birth date is required"],
      validate(value) {
        //Must be at least 13 years old
        const thirteenYearsAgo = new Date();
        thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);

        if (value > thirteenYearsAgo) {
          throw new Error("You must be at least 13 years old to join Craftix");
        }
        if (value > new Date()) {
          throw new Error("Birth date cannot be in the future");
        }
      },
    },
    country: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://via.placeholder.com/150", // תמונת ברירת מחדל
    },
    toolsInventory: [
      {
        type: String, // מערך של מחרוזות (פטיש, מברגה וכו')
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        deviceType: { type: String }, // בונוס: נדע אם זה מובייל או דסקטופ
      },
    ],
  },
  { timestamps: true }, // Gives me information about when the account registerd and when in the last time was update
);

// function for comparing passwords.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//Creating token.
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // limit for 3 devices, if the is already 3, we will disconnect from the oldest.
  if (user.tokens.length >= 3) {
    user.tokens.shift();
  }

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Before we save the information, if there is no displayname, the full name will be the displayname.
// Hash the password so it won’t be exposed
userSchema.pre("save", async function () {
  if (!this.displayName) {
    this.displayName = this.fullName;
  }
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      throw new Error("Error in hiding the password");
    }
  }
});

module.exports = mongoose.model("User", userSchema);
