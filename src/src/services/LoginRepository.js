import axios from 'axios';
import { get_api, login_api } from './Method';
import { delete_api } from './Method';
import { post_api } from './Method';
import { put_api } from './Method';

export function Login(
    formData
    ) {
    return login_api(`http://localhost:3001/cors/api/login`, formData);
}

export function Logout() {
    return post_api(`http://localhost:3001/cors/api/logout`, {});
}




