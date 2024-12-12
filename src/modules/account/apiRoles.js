import { systemRoles } from '../../utils/systemRoles.js';

export const accountApisRoles = {
    CHANGE_PASSWORD:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN],
    ADD_ACCOUNT:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN],
    DELETE_ACCOUNT:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN],
    CHANGE_ROLE:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN],
    UPDATE_PROFILE:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN, systemRoles.EDITOR, systemRoles.CUSTOMER_SERVICE],
    GET_PROFILE:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN, systemRoles.EDITOR, systemRoles.CUSTOMER_SERVICE],
    GET_ALL_USERS:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN],

    LOGOUT:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN,systemRoles.CUSTOMER_SERVICE,systemRoles.EDITOR]
}