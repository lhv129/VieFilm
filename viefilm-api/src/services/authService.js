import { userModel } from "@/models/userModel";
import ApiError from "@/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { roleModel } from "@/models/roleModel";

const login = async (reqBody) => {
    try {
        const user = await userModel.findOne({ email: reqBody.email });
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Email không tồn tại");
        }

        const bcrypt = require("bcrypt");
        const isPasswordValid = bcrypt.compareSync(reqBody.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Mật khẩu không chính xác");
        }

        if(user.status === 'inactive'){
            throw new ApiError(StatusCodes.FORBIDDEN, "Tài khoản của bạn chưa kích hoạt, vui lòng kiểm tra lại email để kích hoạt tài khoản");
        }
        if(user.status === 'block'){
            throw new ApiError(StatusCodes.FORBIDDEN, "Tài khoản của bạn đã bị khóa, vui lòng liên hệ tới admin");
        }

        // Tạo Access Token và Refresh Token
        const accessToken = generateAccessToken(user);
        let refreshToken = await generateRefreshToken(user);
        const newUser = {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: user
        }
        return newUser;
    } catch (error) {
        throw error;
    }
};

const register = async (reqBody) => {
    try {
        // Lấy ra id của role member
        const memberRoleId = await roleModel.findOne({ name: "Member" });

        // Loại bỏ password_confirm
        delete reqBody.password_confirm;
        const bcrypt = require("bcrypt");
        // Hash password
        const saltRounds = 1;
        const hashedPassword = bcrypt.hashSync(reqBody.password, saltRounds);
        reqBody.password = hashedPassword;

        const newUser = {
            ...reqBody,
            roleId: memberRoleId._id.toString(),
            images:
                "https://res.cloudinary.com/dewhibspm/image/upload/v1745010004/default_twvy3l.jpg",
        };

        //Kiểm tra username và email đã tồn tại chưa
        const existingUsername = await userModel.findOne({
            username: newUser.username,
        });
        const existingUserEmail = await userModel.findOne({
            email: newUser.email,
        });
        if (existingUsername && existingUserEmail) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Tên và email đã tồn tại, vui lòng nhập lại");
        } else if (existingUsername) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Tên đã tồn tại, vui lòng nhập tên khác");
        } else if (existingUserEmail) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Email đã tồn tại, vui lòng nhập email khác");
        }

        // Nếu chưa tồn tại thì thêm mới
        const createdUser = await userModel.create(newUser);
        // Lấy ra bản ghi sau khi thêm
        const getNewUser = await userModel.findOneById(
            createdUser.insertedId.toString()
        );

        // Tạo Access Token và Refresh Token
        const accessToken = generateAccessToken(getNewUser);
        let refreshToken = await generateRefreshToken(getNewUser);
        const newUserForToken = {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: getNewUser
        }

        return newUserForToken;
    } catch (error) {
        throw error;
    }
}

const refreshToken = async (reqBody) => {
    try {
        const user = await userModel.findOne({ refresh_token: reqBody.refresh_token });
        if(!user){
            throw new ApiError(StatusCodes.NOT_FOUND, "Token không hợp lệ hoặc đã hết hạn");
        }
        const accessToken = generateAccessToken(user);

        const newUser = {
            access_token: accessToken,
            refresh_token: user.refresh_token,
            user: user
        }
        return newUser;
    } catch (error) {
        throw error;
    }
}

export const authService = {
    login,
    register,
    refreshToken
}