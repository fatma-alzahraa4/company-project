import { systemRoles } from '../../utils/systemRoles.js';

export const projectApisRoles = {
    ADD_PROJECT:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN,systemRoles.EDITOR],
    EDIT_PROJECT:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN,systemRoles.EDITOR],
    DELETE_PROJECT:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN,systemRoles.EDITOR],
    GET_PROJECTS:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN,systemRoles.EDITOR],
    GET_PROJECTS:[systemRoles.SUPER_ADMIN,systemRoles.ADMIN,systemRoles.EDITOR],
}