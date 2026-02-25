import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Bell, Moon, Globe, Shield, Download, Trash2, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 100, cursor: 'pointer',
        background: value ? 'var(--jade)' : 'var(--bg-raised)',
        border: `2px solid ${value ? 'var(--jade)' : 'rgba(255,255,255,0.1)'}`,
        position: 'relative', transition: 'all 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 2,
        left: value ? 22 : 2,
        transition: 'left 0.2s',
      }} />
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifNewCourse: true, notifChallenge: true, notifReminder: true, notifProgress: false,
    offlineMode: true, darkMode: true, language: 'fr',
  });
  const [loading, setLoading] = useState(false);

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));

  const save = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success('Paramètres sauvegardés !'); }, 800);
  };

  const SettingRow = ({ icon: Icon, label, desc, settingKey }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="var(--text-secondary)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
          {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
        </div>
      </div>
      <Toggle value={settings[settingKey]} onChange={() => toggle(settingKey)} />
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ maxWidth: 580 }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 28 }}>Paramètres</h2>

        {/* Notifications */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🔔 Notifications</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Gérez quand et comment vous êtes alerté</p>
          <SettingRow icon={Bell} label="Nouveaux cours" desc="Lorsqu'un professeur publie un nouveau contenu" settingKey="notifNewCourse" />
          <SettingRow icon={Bell} label="Défi journalier" desc="Rappel chaque matin pour votre défi du jour" settingKey="notifChallenge" />
          <SettingRow icon={Bell} label="Rappels de révision" desc="Basés sur l'algorithme de répétition espacée" settingKey="notifReminder" />
          <SettingRow icon={Bell} label="Alertes de progression" desc="Si une baisse de performance est détectée" settingKey="notifProgress" />
        </div>

        {/* App settings */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>⚙️ Application</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Préférences générales de l'application</p>
          <SettingRow icon={Download} label="Mode hors-ligne" desc="Téléchargez les cours pour y accéder sans connexion" settingKey="offlineMode" />
          <SettingRow icon={Moon} label="Thème sombre" desc="Interface sombre (recommandé pour économiser la batterie)" settingKey="darkMode" />
        </div>

        {/* Language */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🌐 Langue</h3>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Langue de l'interface</label>
            <select className="input-field" value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(255,107,107,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--coral)', marginBottom: 16 }}>⚠️ Zone dangereuse</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => toast('Données supprimées (simulation)')}>
              <Trash2 size={14} /> Supprimer mes données
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => toast.error('Compte supprimé (simulation)')}>
              Supprimer mon compte
            </button>
          </div>
        </div>

        <button onClick={save} className="btn btn-primary" disabled={loading}>
          {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sauvegarde...</> : <><Save size={15} /> Sauvegarder les paramètres</>}
        </button>
      </div>
    </div>
  );
}
