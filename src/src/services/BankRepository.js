import axios from 'axios';
import { get_api } from './Method';
import { delete_api } from './Method';
import { post_api } from './Method';
import { put_api } from './Method';
import { get_api_with_params } from './Method';

export function getAllBank() {    
    return get_api(`http://localhost:3001/cors/api/BankInfo/getAllBank`)
}

export function getBankCodeName() {    
    return get_api(`http://localhost:3001/cors/api/BankInfo/getBankCodeName`)
}

export function getBankRegion(
    data = {}
) {    
    return get_api_with_params(`http://localhost:3001/cors/api/BankInfo/getBankRegion`, data)
}

export function getBankBranch(
    data = {}
) {    
    return get_api_with_params(`http://localhost:3001/cors/api/BankInfo/getBankBranch`, data)
}

export function addBank(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/BankInfo/insertBank`, formData);
}

export function updateBank(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/BankInfo/updateBank`, formData);
}

export function deleteBank(
    BANK_CD = "00000",
    ) {    
    return post_api(`http://localhost:3001/cors/api/BankInfo/deleteBank`, BANK_CD)
}







