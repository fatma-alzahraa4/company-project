import joi from "joi"
import { generalFields } from '../../middleWares/validation.js';

export const signUpSchema = {
    body: joi.object({
        firstName: joi
            .string()
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.empty': 'First name is required',
                'string.min': 'First name should have a minimum length of 2 characters',
                'string.max': 'First name should not exceed 30 characters',
            }),
        lastName: joi
            .string()
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.empty': 'Last name is required',
                'string.min': 'Last name should have a minimum length of 2 characters',
                'string.max': 'Last name should not exceed 30 characters',
            }),
        email: generalFields.email.required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
        }),
        phoneNumber: generalFields.phoneNumbers.required().messages({
            'string.pattern.base': 'Phone number must be a valid Egyptian phone number',
        }),
        password: generalFields.password.required().messages({
            'string.pattern.base': 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one digit',
        })
    }).required()
};

export const verifyEmailSchema ={
    body:joi.object({
        verificationToken:joi.string().required(),
        verificationCode:joi
        .string()
        .length(4)
        .required(),
    }).required().options({presence:"optional"})
}

export const signInSchema = {
    body: joi.object({
        email: generalFields.email.required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
        }),
        password: generalFields.password.required().messages({
            'string.pattern.base': 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one digit',
        })
    }).required()
};

export const resendCodeSchema = {
    params: joi.object({
        accountId: generalFields._id.required()
    }).required()
};

export const forgetPassSchema = {
    body: joi.object({
        email: generalFields.email.required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
        })
    }).required()
};

export const resetPassSchema ={
    body:joi.object({
        newPassword:generalFields.password,
        forgetToken:joi.string().required(),
        forgetCode:joi
        .string()
        .length(4)
        .required(),

    }).required().options({presence:"optional"})
}

export const changePassSchema ={
    body:joi.object({
        newPassword:generalFields.password,
        oldPassword:generalFields.password
    }).required().options({presence:"optional"})

}

export const addAccountSchema = {
    body: joi.object({
        firstName: joi
            .string()
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.empty': 'First name is required',
                'string.min': 'First name should have a minimum length of 2 characters',
                'string.max': 'First name should not exceed 30 characters',
            }),
        lastName: joi
            .string()
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.empty': 'Last name is required',
                'string.min': 'Last name should have a minimum length of 2 characters',
                'string.max': 'Last name should not exceed 30 characters',
            }),
        email: generalFields.email.required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
        }),
        phoneNumber: generalFields.phoneNumbers.required().messages({
            'string.pattern.base': 'Phone number must be a valid Egyptian phone number',
        }),
        password: generalFields.password.required().messages({
            'string.pattern.base': 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one digit',
        }),
        role:joi.string().min(5).max(15).valid('editor','customerService').required()
    }).required()
};

export const deleteAccountSchema = {
    params: joi.object({
        userId: generalFields._id.required()
    }).required()
};

export const changeRoleSchema = {
    body: joi.object({
        email: generalFields.email.required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
        }),
        role:joi.string().min(5).max(15).valid('editor','customerService').required()
    }).required()
};

export const updateProfileSchema ={
    body:joi.object({
        firstName: joi
        .string()
        .min(2)
        .max(30)
        .messages({
            'string.min': 'First name should have a minimum length of 2 characters',
            'string.max': 'First name should not exceed 30 characters',
        }),
    lastName: joi
        .string()
        .min(2)
        .max(30)
        .messages({
            'string.min': 'Last name should have a minimum length of 2 characters',
            'string.max': 'Last name should not exceed 30 characters',
        }),
    phoneNumber: generalFields.phoneNumbers.messages({
        'string.pattern.base': 'Phone number must be a valid Egyptian phone number',
    }),
        // altImage: joi.object({
        //     en: joi.string().messages({
        //         'string.base': '"en" should be a string',
        //     }),
        //     ar: joi.string().messages({
        //         'string.base': '"ar" should be a string',
        //     })
        // }).messages({
        //     'object.base': '"altImage" must be an object',
        // }),
    }).required().options({presence:"optional"})

}

export const changeUserPassSchema ={
    params: joi.object({
        userId:generalFields._id.required(),
    }).required(),
    body:joi.object({
        newPassword:generalFields.password,
        oldPassword:generalFields.password
    }).required().options({presence:"optional"})

}