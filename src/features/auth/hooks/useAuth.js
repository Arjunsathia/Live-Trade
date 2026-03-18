import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { authApi } from '../api/authApi';
import { 
    setCredentials, 
    logout as logoutAction, 
    setLoading, 
    setError,
    selectCurrentUser,
    selectIsAuthenticated
} from '../store/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const error = useSelector((state) => state.auth.error);

    const login = useCallback(async (email, password) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await authApi.login({ email, password });
            
            // Assuming the API returns { user, tokens: { access_token } }
            dispatch(setCredentials({ 
                user: data.user, 
                accessToken: data.tokens.access_token 
            }));
            
            return data;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'Login failed'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const register = useCallback(async (userData) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await authApi.register(userData);
            return data; // Typically registration requires email verify or login next
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'Registration failed'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(logoutAction());
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout
    };
};
