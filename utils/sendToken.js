export const sendToken = (res, statusCode, user) => {
    const token = user.getJWTToken();
    user.password = undefined;
    
    res.status(statusCode).json({
        success: true,
        token: token,
        user: user
    });
}