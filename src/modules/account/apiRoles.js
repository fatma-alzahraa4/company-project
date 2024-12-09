import { systemRoles } from '../../utils/systemRoles.js';

export const accountApisRoles = {
    CHANGE_PASSWORD:[systemRoles.ADMIN],
    ADD_ACCOUNT:[systemRoles.ADMIN],
    DELETE_ACCOUNT:[systemRoles.ADMIN],
    CHANGE_ROLE:[systemRoles.ADMIN],
    UPDATE_PROFILE:[systemRoles.ADMIN, systemRoles.EDITOR, systemRoles.CUSTOMER_SERVICE],
    GET_PROFILE:[systemRoles.ADMIN, systemRoles.EDITOR, systemRoles.CUSTOMER_SERVICE],
    GET_ALL_USERS:[systemRoles.ADMIN],

    LOGOUT:[systemRoles.ADMIN,systemRoles.CUSTOMER_SERVICE,systemRoles.EDITOR]
}