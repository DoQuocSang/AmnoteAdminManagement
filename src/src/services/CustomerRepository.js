import axios from 'axios';
import { get_api } from './Method';
import { delete_api } from './Method';
import { post_api } from './Method';
import { put_api } from './Method';

export function getAllCustomer() {    
    return get_api(`http://localhost:3001/cors/api/CustomerInfo/getAllCustomer`)
}

export function getSelectTypeCustomer() {    
    return get_api(`http://localhost:3001/cors/api/CustomerInfo/getSelectTypeCustomer`)
}

export function addCustomer(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/CustomerInfo/insert`, formData);
}

export function updateCustomer(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/CustomerInfo/update`, formData);
}

export function deleteCustomer(
    CustomerCD = "00000",
    ) {    
    return post_api(`http://localhost:3001/cors/api/CustomerInfo/delete`, CustomerCD)
}






