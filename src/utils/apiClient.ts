import axios from 'axios';
import useAuthStore from '@/store/authStore';

// A production build without VITE_API_URL set must fail loudly rather than silently
// routing real users' deposits/bets to the test backend.
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
	throw new Error('VITE_API_URL must be set for production builds.');
}

const apiURL = import.meta.env.VITE_API_URL || 'https://testapi.maxilotto.ng/api/';

const apiClient = axios.create({
	baseURL: apiURL,
	timeout: 60000,
});

// --- Request Interceptor (Authentication) ---
apiClient.interceptors.request.use(
	(config) => {
		// Access the state dynamically here (GOOD)
		const accessToken = useAuthStore.getState().accessToken;

		if (accessToken) {
			// Note: You might need to add 'Bearer ' depending on your backend
			config.headers.Authorization = `Bearer ${accessToken}`;
			// config.headers.Authorization = `${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const { response, message } = error;

		if (!response) {
			console.warn('⚠️ Network or CORS issue:', message);
			// Don't reject with "Error: Network error" directly; make it descriptive
			return Promise.reject(
				new Error('Network unreachable or server not responding.')
			);
		}

		// Handle expired token (401)
		if (
			response.status === 401 ||
			response?.data?.message === 'Access denied. No token provided.'
		) {
			console.log('🔒 Session expired. Logging out.');
			useAuthStore.getState().clearToken();
			//window.location.href = '/';
		}

		return Promise.reject(error);
	}
);

export default apiClient;
