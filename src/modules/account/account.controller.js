import pkg from 'bcrypt'
import { customAlphabet } from 'nanoid';
import { sendEmailService } from "../../services/sendEmail.js";
import { generateToken, verifyToken } from '../../utils/tokenFunction.js';
import { isTempEmail } from '../../utils/blockTempEmailDomains.js';
import { accountModel } from './../../../DB/models/accountModel.js';
import cloudinary from '../../utils/cloudinaryConfigrations.js';
import { clientRedis } from './../../utils/redis.js';

const nanoIdImage = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};
const nanoId = customAlphabet('012345689', 4)

//TODO Uncomment Send Email Service
//========================================== signUp ============================================

export const adminSignUp = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    } = req.body
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    if (isTempEmail(email)) {
        return res.status(400).json({ message: 'Temporary email addresses are not allowed.' });
    }
    const isAdminDuplicate = await accountModel.findOne({ $or: [{ email }, { phoneNumber }] })
    if (isAdminDuplicate) {
        return next(new Error('Admin already registered with same email or phone', { cause: 409 }))
    }
    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)

    const verificationCode = nanoId();
    const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    const token = generateToken({
        payload: { email },
        signature: process.env.CONFIRMATION_EMAIL_TOKEN,
        expiresIn: '15m'
    });

    const adminObj = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified: false,
        verificationCode: hashedVerificationCode,
        role: 'admin'
    }
    const admin = await accountModel.create(adminObj)
    // const isEmailSent = sendEmailService(
    //     {
    //         to: email,
    //         subject: 'Verification Email',
    //         message: `
    //         Here Is Your Verification Code :    ${verificationCode},
    //         `,
    //     })
    // if (! await isEmailSent) {
    //     return next(new Error('fail to send email', { cause: 400 }))
    // }
    //COOKIES set verificationToken in cookies
    res.status(200).json({ message: 'Check your gmail and verify your account', verificationToken: token, verificationCode, adminId: admin._id })
}

//========================================== verify account ==========================================

export const verifyEmail = async (req, res, next) => {
    const { verificationToken, verificationCode } = req.body
    const decoded = verifyToken({
        token: verificationToken,
        signature: process.env.CONFIRMATION_EMAIL_TOKEN
    })
    const admin = await accountModel.findOne(
        {
            $and:
                [
                    { $or: [{ role: 'admin' }, { role: 'editor' }, { role: 'customerService' }] },
                    { email: decoded?.email },
                    { isVerified: false }
                ]
        }
    )
    if (!admin) {
        return next(new Error('This account was verified before ', { cause: 400 }))
    }
    const isVerificationCodeMatch = pkg.compareSync(verificationCode, admin.verificationCode)
    if (!isVerificationCodeMatch) {
        return next(new Error('There is someThing Wrong in verification Code', { cause: 400 }))
    }
    admin.isVerified = true
    admin.verificationCode = null
    await admin.save()
    res.status(200).json({ message: 'Verification Done' })
}

//============================================ signIn ==============================================

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const existAccount = await accountModel.findOne({ email })
    if (!existAccount) {
        return next(new Error('invalid login credentials', { cause: 400 }))
    }
    const isPassMatch = pkg.compareSync(password, existAccount.password)
    if (!isPassMatch) {
        return next(new Error('invalid login credentials', { cause: 400 }))
    }

    if (!existAccount.isVerified) {
        const verificationCode = nanoId();
        const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
        const token = generateToken({
            payload: { email, verificationCode },
            signature: process.env.CONFIRMATION_EMAIL_TOKEN,
            expiresIn: '15m'
        });
        existAccount.verificationCode = hashedVerificationCode;
        await existAccount.save();

        // const isEmailSent = sendEmailService(
        //     {
        //         to: email,
        //         subject: 'Verification Email',
        //         message: `
        //         Here Is Your Verification Code :    ${verificationCode},
        //         `,
        //     })
        // if (! await isEmailSent) {
        //     return next(new Error('fail to send email', { cause: 400 }))
        // }
        //COOKIES set verificationToken in cookies
        return res.status(403).json({ message: 'Check you gmail and verify your account', verificationToken: token, accountId: existAccount._id, verificationCode })
    }
    const accountToken = generateToken({
        payload: {
            email,
            _id: existAccount._id,
        },
        signature: process.env.ADMIN_TOKEN_SIGNATURE,
        expiresIn: '7d'
    });
    const account = await accountModel.findOneAndUpdate({ email }, { token: accountToken }, { new: true })
    if (!account) {
        return next(new Error('failed to login', { cause: 400 }))
    }
    const response = {
        _id: account._id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        role:account.role,
        profileImage: {
            secure_url: account.profileImage.secure_url,
            // alt: updatedUser.profileImage.alt,
        },
        token: account.token,
    }
    res.status(200).json({ message: 'Done', account: response })
}

//========================================== resend verification code ==========================================

export const resendVerificationCode = async (req, res, next) => {
    const { accountId } = req.params
    const account = await accountModel.findOne({ _id: accountId })    
    const verificationCode = nanoId();
    const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    // const isEmailSent = sendEmailService(
    //     {
    //         to: account.email,
    //         subject: 'Verification Email',
    //         message: `
    //         Your verification code is:    ${verificationCode},
    //         `,
    //     })
    // if (! await isEmailSent) {
    //     return next(new Error('fail to send email', { cause: 400 }))
    // }
    account.verificationCode = hashedVerificationCode
    account.save();
    res.status(200).json({ message: 'Done' })

}

//========================================== forget password ==========================================

export const forgetPassword = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const admin = await accountModel.findOne({ email, role: 'admin' })
    if (!admin) {
        return next(new Error('invalid email', { cause: 400 }))
    }
    const code = nanoId()
    const hashedCode = pkg.hashSync(code, +process.env.SALT_ROUNDS)
    const token = generateToken({
        payload: { email },
        signature: process.env.RESET_TOKEN,
        expiresIn: '15m'
    })
    // const isEmailSent = sendEmailService({
    //     to: email,
    //     subject: 'reset Password',
    //     message: `Your Reset code is : ${code}`
    // })

    // if (! await isEmailSent) {
    //     return next(new Error('failed to send  email', { cause: 400 }))
    // }
    await accountModel.findOneAndUpdate({ email }, { forgetCode: hashedCode }, { new: true })
    res.status(200).json({ message: 'Check you gmail to reset password', forgetToken: token, forgetCode:code })
}

//========================================== resend forget code ==========================================

export const resendForgetCode = async (req, res, next) => {
    const { accountId } = req.params
    const admin = await accountModel.findOne({ _id: accountId, role: 'admin' })
    const code = nanoId()
    const hashedCode = pkg.hashSync(code, +process.env.SALT_ROUNDS)
    // const isEmailSent = sendEmailService({
    //     to: email,
    //     subject: 'reset Password',
    //     message: `Your Reset code is : ${code}`
    // })

    // if (! await isEmailSent) {
    //     return next(new Error('failed to send  email', { cause: 400 }))
    // }
    admin.forgetCode = hashedCode
    admin.save();
    res.status(200).json({ message: 'Done' })

}

//========================================== reset password ==========================================

export const resetPassword = async (req, res, next) => {
    const { forgetToken, forgetCode, newPassword } = req.body
    if (!forgetToken || !forgetCode || !newPassword) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const decoded = verifyToken({ token: forgetToken, signature: process.env.RESET_TOKEN })
    const admin = await accountModel.findOne({
        email: decoded?.email,
        role: 'admin'
    })
    if (!admin) {
        return next(new Error('Invalid email', { cause: 400 }))
    }
    if(!admin.forgetCode){
        return next(new Error('you reseted your password before', { cause: 400 }))
    }

    const isCodeMatch = pkg.compareSync(forgetCode, admin.forgetCode)
    if (!isCodeMatch) {
        return next(new Error('the code doesnot match', { cause: 400 }))
    }
    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)
    const changePasswordTime = Date.now()
    const resetedAdmin = await accountModel.findByIdAndUpdate(admin._id, { password: hashedPassword, forgetCode: null, changePasswordTime }, { new: true })
    const response = {
        adminId: resetedAdmin._id,
        firstName: resetedAdmin.firstName,
        lastName: resetedAdmin.lastName,
        email: resetedAdmin.email,
        phoneNumber: resetedAdmin.phoneNumber,
        token: resetedAdmin.token,
    }
    res.status(200).json({ message: 'Done', admin: response })

}

//========================================== change password =========================================

export const changePassword = async (req, res, next) => {
    const { _id } = req.authAccount
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    const admin = await accountModel.findOne({_id,role:'admin'})
    if (!admin) {
        return next(new Error('no admin', { cause: 401 }))
    }
    let oldPassMatch = pkg.compareSync(oldPassword, admin?.password)
    if (!oldPassMatch) {
        return next(new Error('wrong old password', { cause: 400 }))
    }
    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

    admin.password = hashedPassword
    const resetedAdmin = await admin.save()
    const response = {
        adminId: resetedAdmin._id,
        firstName: resetedAdmin.firstName,
        lastName: resetedAdmin.lastName,
        email: resetedAdmin.email,
        phoneNumber: resetedAdmin.phoneNumber,
        profileImage: {
            secure_url: resetedAdmin.profileImage.secure_url,
            // alt: updatedUser.profileImage.alt,
        },
        token: resetedAdmin.token,
    }
    res.status(200).json({ message: 'Done', admin: response })
}

//=========================================== add profile picture=====================================

export const updateProfile = async (req, res, next) => {
    const { _id } = req.authAccount
    const {
        firstName,
        lastName,
        phoneNumber,
    } = req.body
    const user = await accountModel.findOne({ _id })
    if (!user) {
        return next(new Error('no user', { cause: 401 }))
    }
    if (phoneNumber) {
        const isUserDuplicate = await accountModel.findOne({ phoneNumber })
        if (isUserDuplicate) {
            return next(new Error('User already registered with same phone', { cause: 409 }))
        }
        user.phoneNumber = phoneNumber
    }
    let uploadedPublicId, uploadedFolder;
    let profile_image;
    if (req.file) {
        if (user.profileImage.public_id) {
            await cloudinary.uploader.destroy(user.profileImage.public_id);
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Profile/${user.profileImage.customId}`)
        }

        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoIdImage()}`
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.PROJECT_FOLDER}/Profile/${customId}`
            })
        profile_image = {
            secure_url,
            public_id,
            customId,
        }
        uploadedPublicId = public_id;
        uploadedFolder = `${process.env.PROJECT_FOLDER}/Profile/${customId}`
    }
    else {
        profile_image = user.profileImage
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profileImage = profile_image;
    const updatedUser = await user.save();
    if (!updatedUser) {
        await cloudinary.uploader.destroy(uploadedPublicId)
        await cloudinary.api.delete_folder(uploadedFolder)
        return next(new Error('Failed to update', { cause: 400 }))
    }

    clientRedis.del('reviewsWebsite');
    res.status(200).json({
        message: 'Done', user: {
            // userId: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            profileImage: {
                secure_url: updatedUser.profileImage.secure_url,
                // alt: updatedUser.profileImage.alt,
            },
            token: updatedUser.token,
            role:updatedUser.role
        }
    })
}

//========================================== get profile ================================================

export const getProfile = async (req, res, next) => {
    const { _id } = req.authAccount
    const user = await accountModel.findById(_id).select('firstName lastName email phoneNumber profileImage.secure_url -_id')
    res.status(200).json({
        message: 'Done', user
    })
}
//============================================== logOut ==============================================

export const logOut = async (req, res, next) => {
    //clear cookies
    // res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
}

//============================================== add account ==============================================

export const addAccount = async (req, res, next) => { 
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role
    } = req.body
    if (!firstName || !lastName || !email || !phoneNumber || !password || !role) {
        return next(new Error('all fields are required', { cause: 400 }))
    }
    if (role != 'customerService' && role != 'editor') {
        return next(new Error('please enter valid role', { cause: 400 }))
    }
    if (isTempEmail(email)) {
        return res.status(400).json({ message: 'Temporary email addresses are not allowed.' });
    }
    const isAccountDuplicate = await accountModel.findOne({ $or: [{ email }, { phoneNumber }] },)
    if (isAccountDuplicate) {
        return next(new Error('Account is already exist with same email or phone', { cause: 409 }))
    }
    const hashedPassword = pkg.hashSync(password, +process.env.SALT_ROUNDS)

    // const verificationCode = nanoId();
    // const hashedVerificationCode = pkg.hashSync(verificationCode, +process.env.SALT_ROUNDS)
    // const token = generateToken({
    //     payload: { email },
    //     signature: process.env.CONFIRMATION_EMAIL_TOKEN,
    //     expiresIn: '15m'
    // });

    const accountObj = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        isVerified: true,
        verificationCode: null,
        role
    }
    const account = await accountModel.create(accountObj)
    // const isEmailSent = sendEmailService(
    //     {
    //         to: email,
    //         subject: 'Verification Email',
    //         message: `
    //         Here Is Your Verification Code :    ${verificationCode},
    //         `,
    //     })
    // if (! await isEmailSent) {
    //     return next(new Error('fail to send email', { cause: 400 }))
    // }
    //COOKIES set verificationToken in cookies
    
    const response = {
        _id:account._id,
        firstName:account.firstName,
        lastName:account.lastName,
        email:account.email,
        phoneNumber:account.phoneNumber,
        role:account.role,
    }
    res.status(200).json({ message: 'Done', account:response})
}

//============================================== get website users ==============================================

export const getAllDashboardUsers = async (req,res,next) => {
    const users = await accountModel.find(                    
        { $or: [{ role: 'editor' }, { role: 'customerService' }] },
    ).select('firstName lastName email phoneNumber profileImage.secure_url role createdAt')
    res.status(200).json({ message: 'Done', dashboardUsers: users })

}

//============================================== delete account ==============================================
// export const changeaccountPassword = async (req, res, next) => {
//     const { _id } = req.authAdmin
//     const {email, oldPassword, newPassword } = req.body
//     if (!oldPassword || !newPassword) {
//         return next(new Error('all fields are required', { cause: 400 }))
//     }
//     const admin = await accountModel.findById(_id)
//     if (!admin) {
//         return next(new Error('no admin', { cause: 401 }))
//     }
//     let oldPassMatch = pkg.compareSync(oldPassword, admin?.password)
//     if (!oldPassMatch) {
//         return next(new Error('wrong old password', { cause: 400 }))
//     }
//     const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

//     admin.password = hashedPassword
//     const resetedAdmin = await admin.save()
//     const response = {
//         adminId: resetedAdmin._id,
//         firstName: resetedAdmin.firstName,
//         lastName: resetedAdmin.lastName,
//         email: resetedAdmin.email,
//         phoneNumber: resetedAdmin.phoneNumber,
//         token: resetedAdmin.token,
//     }
//     res.status(200).json({ message: 'Done', admin: response })
// }

//============================================== delete account ==============================================


export const deleteAccount = async (req, res, next) => {
    const { userId } = req.params

    const deletedAccount = await accountModel.findOneAndDelete(
        {
            $and:
                [
                    { _id:userId },
                    { $or: [{ role: 'editor' }, { role: 'customerService' }] },
                ]
        }
    )
    if(!deletedAccount){
        return next(new Error('no account found with that email', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done'})

}

//============================================== change role ==============================================

export const changeRole = async (req,res,next) => {
    const {email, role} = req.body
    if(!email){
        return next(new Error('Email is required', { cause: 400 }))
    }
    if (role != 'customerService' && role != 'editor') {
        return next(new Error('please enter valid role', { cause: 400 }))
    }
    const updatedAccount = await accountModel.findOneAndUpdate(
        {
            $and:
                [
                    { email },
                    { $or: [{ role:'editor' }, { role:'customerService' }] },
                ]
        },
        {role},
        {new:true}
    )
    if(!updatedAccount) {
        return next(new Error('failed to change role', { cause: 400 }))
    }
    const response = {
        _id:updatedAccount._id,
        firstName:updatedAccount.firstName,
        lastName:updatedAccount.lastName,
        email:updatedAccount.email,
        phoneNumber:updatedAccount.phoneNumber,
        role:updatedAccount.role,
    }
    res.status(200).json({ message: 'Done', account:response})
}

//========================================== change user password =========================================

export const changeUserPassword = async (req, res, next) => {
    const { userId } = req.params
    const { oldPassword, newPassword } = req.body
    const requiredInputs = [
        'oldPassword',
        'newPassword'
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    const user = await accountModel.findOne({
        $and:
            [
                { _id:userId },
                { $or: [{ role: 'editor' }, { role: 'customerService' }] },
            ]
    })
    if (!user) {
        return next(new Error('this action allowed only for editor and customer servicse users', { cause: 401 }))
    }
    let oldPassMatch = pkg.compareSync(oldPassword, user?.password)
    if (!oldPassMatch) {
        return next(new Error('wrong old password', { cause: 400 }))
    }
    const hashedPassword = pkg.hashSync(newPassword, +process.env.SALT_ROUNDS)

    user.password = hashedPassword
    user.changePasswordTime = Date.now();
    const resetedUser = await user.save()
    const response = {
        _id: resetedUser._id,
        firstName: resetedUser.firstName,
        lastName: resetedUser.lastName,
        email: resetedUser.email,
        phoneNumber: resetedUser.phoneNumber,
        profileImage: {
            secure_url: resetedUser.profileImage.secure_url,
        },
        token: resetedUser.token,
    }
    res.status(200).json({ message: 'Done', user: response })
}