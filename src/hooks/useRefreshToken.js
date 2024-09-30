import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { auth } = useAuth();
    let payload = {
        "token": auth.refreshToken
    };

    const refresh = async () => {
        const response = await axios.post('/auth/refreshToken', payload, {
            withCredentials: false
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.token }
        });
        return response.data.token;
    }
    return refresh;
};

export default useRefreshToken;