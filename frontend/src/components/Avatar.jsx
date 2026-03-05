import { User as UserIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

export default function Avatar({ src, firstName, lastName, size = 32, className = '' }) {
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';

    // Si l'URL est absolue (commence par http), on l'utilise directement.
    // Sinon, on construit l'URL avec BASE_URL
    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        // S'assurer qu'il y a un slash entre BASE_URL et url
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${BASE_URL}${cleanUrl}`;
    };

    const fullUrl = getFullUrl(src);

    if (fullUrl) {
        return (
            <img
                src={fullUrl}
                alt={`${firstName} ${lastName}`}
                className={`rounded-full object-cover border border-white/10 ${className}`}
                style={{ width: size, height: size, minWidth: size, minHeight: size }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = ''; // Force switch to initials if image fails
                    e.target.classList.add('hidden');
                }}
            />
        );
    }

    return (
        <div
            className={`rounded-full bg-amber flex items-center justify-center font-bold text-white shadow-sm border border-white/5 ${className}`}
            style={{ width: size, height: size, minWidth: size, minHeight: size, fontSize: size * 0.4 }}
        >
            {initials}
        </div>
    );
}
