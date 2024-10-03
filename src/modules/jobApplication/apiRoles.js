import { systemRoles } from '../../utils/systemRoles.js';

export const jobApisRoles = {
    JOB_APIS:[systemRoles.ADMIN],
    LOGOUT:[systemRoles.ADMIN,systemRoles.CUSTOMER_SERVICE,systemRoles.EDITOR]
}