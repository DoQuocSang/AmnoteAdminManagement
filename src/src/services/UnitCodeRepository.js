import axios from 'axios';
import { get_api } from './Method';
import { delete_api } from './Method';
import { post_api } from './Method';
import { put_api } from './Method';

export function getAllUnitCode() {    
    return get_api(`http://localhost:3001/cors/api/ProductUnitInfo/getAll`)
}

export function addUnitCode(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/ProductUnitInfo/insert`, formData);
}

export function updateUnitCode(
    formData
    ) {
    return post_api(`http://localhost:3001/cors/api/ProductUnitInfo/update`, formData);
}

export function deleteUnitCode(
    UnitCodeCD = "00000",
    ) {    
    return post_api(`http://localhost:3001/cors/api/ProductUnitInfo/delete`, UnitCodeCD)
}






