import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Video, FileText, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { notificationService } from '../services/services';

const getIconForType = (type) => {
    switch (type) {
        case 'session': return Video;
        case 'exercise': return FileText;
        case 'grade': return Star;
        case 'classroom': return CheckCircle;
        default: return Bell;
    }
};

export default function NotificationsPage() {
    const [notifs, setNotifs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        notificationService.getMyNotifications()
            .then(({ data }) => setNotifs(data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const unread = notifs.filter(n => !n.read).length;

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifs(n => n.map(x => ({ ...x, read: true })));
        } catch (err) { console.error(err); }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifs(prev => prev.map(x => x._id === id ? { ...x, read: true } : x));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="page-container" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
                        Notifications
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est lu'}</p>
                </div>
                {unread > 0 && (
                    <button onClick={handleMarkAllAsRead} className="btn btn-ghost btn-sm">
                        <CheckCheck size={14} /> Tout marquer comme lu
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-md)' }} />)
                ) : notifs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        <Bell size={32} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
                        <div>Vous n'avez aucune notification</div>
                    </div>
                ) : (
                    notifs.map((n, i) => {
                        const Icon = getIconForType(n.type);
                        return (
                            <motion.div key={n._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                onClick={() => !n.read && handleMarkAsRead(n._id)}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', background: n.read ? 'var(--bg-surface)' : 'var(--bg-raised)', border: `1px solid ${n.read ? 'var(--border)' : 'var(--amber-border)'}`, borderRadius: 'var(--radius-md)', cursor: n.read ? 'default' : 'pointer', transition: 'all 0.2s' }}
                            >
                                <div style={{ flexShrink: 0, marginTop: 2, color: 'var(--amber)' }}><Icon size={24} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600, fontSize: 14, color: n.read ? 'var(--text-primary)' : 'var(--amber)' }}>{n.title}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{n.message}</div>
                                </div>
                                {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0, marginTop: 6 }} />}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
