const API_URL = 'http://localhost:8000/api';
const BACKEND_URL = 'http://localhost:8000';

function fullImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return BACKEND_URL + path;
}

const Auth = {
    getToken() { return localStorage.getItem('access_token'); },
    getUsername() { return localStorage.getItem('username'); },
    isLoggedIn() { return !!this.getToken(); },
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        window.location.href = '/';
    },
    headers() {
        const h = { 'Content-Type': 'application/json' };
        const t = this.getToken();
        if (t) h['Authorization'] = `Bearer ${t}`;
        return h;
    }
};