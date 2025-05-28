import { User, Note } from '../model/Model.js';
import jwt from "jsonwebtoken";

export const getAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            const error = new Error("Refresh token tidak ada");
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findOne({
            where: { refresh_token: refreshToken },
        });

        if (!user.refresh_token) {
            const error = new Error("Refresh token tidak ada");
            error.statusCode = 401;
            throw error;
        } else {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (error, decoded) => {
                    if (error) {
                        return res.status(403).json({
                            status: "Error",
                            message: "Refresh token tidak valid",
                        });
                    }

                    const userPlain = user.toJSON();

                    const { password: _, refresh_token: __, ...safeUserData } = userPlain;

                    const accessToken = jwt.sign(
                        safeUserData,
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "30s" }
                    );

                    return res.status(200).json({
                        status: "Success",
                        message: "Successfully get the access token!",
                        accessToken,
                    });
                }
            );
        }
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};