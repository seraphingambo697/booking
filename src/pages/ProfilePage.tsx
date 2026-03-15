
/**
 * src/pages/ProfilePage.tsx
 * Page profil — lire, modifier et supprimer son compte.
 * Exigences cahier des charges : CRUD utilisateur, champ pseudo.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Edit3, Trash2, Save, X, Lock, AtSign } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/authApi";
import { ROUTES } from "@/router/routes";

export function ProfilePage() {
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();

    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [form, setForm] = useState({
        first_name: user?.firstName ?? "",
        last_name: user?.lastName ?? "",
        email: user?.email ?? "",
        pseudo: "",
        phone: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload: Record<string, string> = {};
            if (form.first_name !== user?.firstName) payload.first_name = form.first_name;
            if (form.last_name !== user?.lastName) payload.last_name = form.last_name;
            if (form.email !== user?.email) payload.email = form.email;
            if (form.phone) payload.phone = form.phone;
            if (form.password) payload.password = form.password;

            await authApi.updateMe(payload);
            setSuccess("Profil mis à jour avec succès.");
            setEditing(false);
        } catch (e: any) {
            setError(e.message ?? "Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await authApi.deleteMe();
            clearAuth();
            navigate(ROUTES.HOME);
        } catch (e: any) {
            setError(e.message ?? "Erreur lors de la suppression.");
            setDeleting(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* ── En-tête ── */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                        {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-slate-500 text-sm">{user?.email}</p>
                        {user?.isAdmin && (
                            <span className="inline-block mt-1 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Administrateur
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Alertes ── */}
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{success}</div>}

                {/* ── Carte profil ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">Informations personnelles</h2>
                        {!editing ? (
                            <button
                                onClick={() => { setEditing(true); setSuccess(null); }}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Edit3 className="h-4 w-4" /> Modifier
                            </button>
                        ) : (
                            <button
                                onClick={() => { setEditing(false); setError(null); }}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                            >
                                <X className="h-4 w-4" /> Annuler
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Prénom */}
                        <Field icon={<User className="h-4 w-4" />} label="Prénom"
                            editing={editing} name="first_name" value={form.first_name} onChange={handleChange} />

                        {/* Nom */}
                        <Field icon={<User className="h-4 w-4" />} label="Nom"
                            editing={editing} name="last_name" value={form.last_name} onChange={handleChange} />

                        {/* Pseudo */}
                        <Field icon={<AtSign className="h-4 w-4" />} label="Pseudo"
                            editing={editing} name="pseudo" value={form.pseudo}
                            onChange={handleChange} placeholder="Votre pseudonyme" />

                        {/* Email */}
                        <Field icon={<Mail className="h-4 w-4" />} label="Email"
                            editing={editing} name="email" value={form.email}
                            onChange={handleChange} type="email" />

                        {/* Téléphone */}
                        <Field icon={<Phone className="h-4 w-4" />} label="Téléphone"
                            editing={editing} name="phone" value={form.phone}
                            onChange={handleChange} placeholder="+33 6 xx xx xx xx" />

                        {/* Mot de passe */}
                        {editing && (
                            <Field icon={<Lock className="h-4 w-4" />} label="Nouveau mot de passe"
                                editing={true} name="password" value={form.password}
                                onChange={handleChange} type="password" placeholder="Laisser vide pour ne pas changer" />
                        )}
                    </div>

                    {editing && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                {loading ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Zone danger ── */}
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">Zone de danger</h2>
                    <p className="text-sm text-slate-500 mb-4">
                        La suppression de votre compte est définitive. Toutes vos données seront effacées.
                    </p>

                    {!deleting ? (
                        <button
                            onClick={() => setDeleting(true)}
                            className="flex items-center gap-2 text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors font-medium"
                        >
                            <Trash2 className="h-4 w-4" /> Supprimer mon compte
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-red-700 font-medium">Confirmer la suppression ?</p>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-red-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? "Suppression..." : "Oui, supprimer"}
                            </button>
                            <button
                                onClick={() => setDeleting(false)}
                                className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

/** Composant champ de formulaire réutilisable */
function Field({
    icon, label, editing, name, value, onChange, type = "text", placeholder,
}: {
    icon: React.ReactNode;
    label: string;
    editing: boolean;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
            {editing ? (
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder ?? label}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-slate-700 py-2 px-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400">{icon}</span>
                    {value || <span className="text-slate-400 italic">Non renseigné</span>}
                </div>
            )}
        </div>
    );
}
