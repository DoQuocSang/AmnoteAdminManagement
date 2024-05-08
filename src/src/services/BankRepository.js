import axios from 'axios';
import { get_api } from './Method';
import { delete_api } from './Method';
import { post_api } from './Method';
import { put_api } from './Method';

export function getAllBank() {    
    return get_api(`http://localhost:3001/cors/api/BankInfo/getAllBank`)
}





