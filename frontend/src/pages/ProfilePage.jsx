import { useState } from 'react';
import { User, Save, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { authService } from '../services/services';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';

export default function ProfilePage() {
    const { user, setAuth } = useAuthStore();
    const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', bio: user?.bio || '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.avatar || null);
    const [saving, setSaving] = useState(false);
    const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
    const isProfessor = user?.role === 'PROFESSOR';

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            formData.append('email', form.email);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const { data } = await authService.updateProfile(formData);
            setAuth(data.data, localStorage.getItem('token'));
            setPreviewUrl(data.data.avatar);
            toast.success('Profil mis à jour !');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally { setSaving(false); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Mon profil</h2>

            <div className="card" style={{ marginBottom: 20, padding: '28px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative' }}>
                    <Avatar
                        src={previewUrl}
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        size={72}
                        className="border-2 border-border"
                    />
                    <label style={{ position: 'absolute', bottom: 0, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'var(--amber)', border: '2px solid var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Camera size={13} color="white" />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    </label>
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.firstName} {user?.lastName}</div>
                    <div style={{ fontSize: 13, color: 'var(--amber)' }}>{isProfessor ? `Prof. — ${user?.expertiseField}` : `Étudiant${user?.studyYear ? ` — L${user.studyYear}` : ''}`}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{user?.email}</div>
                </div>
            </div>

            <form onSubmit={handleSave} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="input-group">
                        <label className="input-label">Prénom</label>
                        <input className="input-field" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Nom</label>
                        <input className="input-field" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-label">Email</label>
                    <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                {!isProfessor && (
                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                            {(user?.majors || []).map(m => <span key={m} className="badge badge-amber">{m}</span>)}
                        </div>
                    </div>
                )}
                {isProfessor && (
                    <div className="input-group">
                        <label className="input-label">Domaine d'expertise</label>
                        <input className="input-field" defaultValue={user?.expertiseField} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                )}
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: 8 }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                    Enregistrer les modifications
                </button>
            </form>
        </div>
    );
}
