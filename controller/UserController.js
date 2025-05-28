import { User, Note } from '../model/Model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import "dotenv/config";

//get user
async function getUsers(req, res) {
    try {
        const users = await User.findAll();

        return res.status(200).json({
            status: "Success",
            message: "Successfully retrieved users",
            data: users
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

//by ID
async function getUserById(req, res) {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            status: "Success",
            message: "Successfully retrieved user",
            data: user
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

//register
async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            const error = new Error("Name, email, and password are required");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = await User.create({
            username,
            email: email,
            password: hashedPassword
        });

        return res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//update user
async function updateUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const updateData = { username, email };
        let passwordUpdated = false;

        if (password && password.trim() !== "") {
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (!isSamePassword) {
                updateData.password = await bcrypt.hash(password, 5);
                passwordUpdated = true;
            }
        }

        const updated = await User.update(updateData, { where: { id: req.params.id } });

        if (updated[0] === 0) {
            const error = new Error("User not updated");
            error.statusCode = 400;
            throw error;
        }

        if (updated[0] === 0) {
            const error = new Error("User not updated");
            error.statusCode = 400;
            throw error;
        }

        return res.status(200).json({
            status: "Success",
            message: `User updated successfully${passwordUpdated ? " (password changed)" : ""}`
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

//delete user
async function deleteUser(req, res) {
    try {
        const ifUserExists = await User.findOne({ where: { id: req.params.id } });
        if (!ifUserExists) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const delUser = await User.destroy({ where: { id: req.params.id } });

        if (delUser === 0) {
            const error = new Error("User not deleted");
            error.statusCode = 400;
            throw error;
        }

        return res.status(200).json({
            status: "Success",
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

//login user
async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username: username } });

        if (user) {
            const userPlain = user.toJSON();
            const { password: _, refresh_token: __, ...safeUserData } = userPlain;

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                const error = new Error("Invalid password");
                error.statusCode = 401;
                throw error;
            } else {
                // console.log("Access Token Secret:", process.env.ACCESS_TOKEN_SECRET); //testing purposes
                // console.log("Refresh Token Secret:", process.env.REFRESH_TOKEN_SECRET); //testing purposes
                const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
                const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

                await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });


                //HTTPS
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                });

                //HTTP
                // res.cookie("refreshToken", refreshToken, {
                //     httpOnly: true,
                //     secure: false,
                //     sameSite: "lax",
                //     maxAge: 24 * 60 * 60 * 1000,
                // });

                return res.status(200).json({
                    status: "Success",
                    message: "Login successful",
                    data: safeUserData,
                    accessToken,
                });
            }
        } else {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

//logout user
async function logoutUser(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            const error = new Error("Refresh token not found");
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findOne({ where: { refresh_token: refreshToken } });

        if (!user.refresh_token) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        await User.update({ refresh_token: null }, { where: { id: user.id } });

        res.clearCookie("refreshToken");

        return res.status(200).json({
            status: "Success",
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

export {
    getUsers,
    getUserById,
    register,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser
};