import axios from 'axios';
import { get_api } from './Method';
import { delete_api } from './Method';
import { post_api } from './Method';
import { put_api } from './Method';

export function getAllMaterialCode() {    
    return get_api(`http://localhost:3001/cors/api/ProductKind/getAllProductKind`)
}

export function addMaterialCode(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/ProductKind/insert`, formData);
}

export function updateMaterialCode(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/ProductKind/update`, formData);
}

export function deleteMaterialCode(
    PRODUCTKIND_CD = "00000",
    ) {    
    return post_api(`http://localhost:3001/cors/api/ProductKind/delete`, PRODUCTKIND_CD)
}






