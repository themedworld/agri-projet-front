"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Shield,
  Eye,
  Pencil,
  Users,
  Filter,
  Search,
  MoreHorizontal,
  Trash,
  Briefcase,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ================= TYPES ================= */

interface Company {
  id: number;
  name: string;
}

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  company?: Company | null;
  isActive: boolean;
}

/* ================= PAGE ================= */

export default function UsersAdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===== Filters ===== */
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState(""); // Ajout bonus : recherche textuelle

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Note: Assurez-vous que l'URL est correcte selon votre env
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Accès refusé ou erreur serveur");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= FILTER LOGIC ================= */

  const roles = useMemo(
    () => ["ALL", ...new Set(users.map((u) => u.role))],
    [users]
  );

  const companies = useMemo(() => {
    const list = users
      .map((u) => u.company)
      .filter(Boolean) as Company[];
    // Utiliser un Set sur les noms pour éviter les doublons visuels, 
    // ou filtrer par ID si nécessaire. Ici on garde la logique simple.
    return ["ALL", ...new Set(list.map((c) => c.name))];
  }, [users]);
const handleDelete = async (userId: number) => {
  const confirmed = confirm(
    "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_API_URL}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Échec de la suppression");
    }

    // ✅ Mettre à jour la liste sans recharger la page
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  } catch (err: any) {
    alert(err.message || "Erreur lors de la suppression");
  }
};

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch =
        selectedRole === "ALL" || user.role === selectedRole;

      const companyMatch =
        selectedCompany === "ALL" ||
        user.company?.name === selectedCompany;

      const searchMatch = 
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      return roleMatch && companyMatch && searchMatch;
    });
  }, [users, selectedRole, selectedCompany, searchTerm]);

  /* ================= UI COMPONENTS ================= */

  // Composant Loading
  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500 items-center justify-center text-white">
            <Users size={20} />
          </span>
        </div>
        <p className="text-sm font-medium animate-pulse">Chargement des données...</p>
      </div>
    );
  }

  // Composant Erreur
  if (error) {
    return (
      <div className="mx-auto max-w-2xl mt-10 rounded-xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle size={24} />
        </div>
        <h3 className="text-lg font-semibold text-red-800">Une erreur est survenue</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  /* ================= MAIN RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Utilisateurs
          </h1>
          <p className="mt-1 text-slate-500">
            Gérez les accès, les rôles et les profils de votre organisation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            {users.length} Total
          </span>
          <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {users.filter(u => u.isActive).length} Actifs
          </span>
        </div>
      </div>

      {/* ===== FILTERS & TOOLBAR ===== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search Bar (Bonus UX) */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="md:col-span-7 flex flex-wrap md:justify-end gap-3">
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
            <Shield size={16} className="text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer min-w-[120px]"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "ALL" ? "Tous les rôles" : role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
            <Building2 size={16} className="text-slate-400" />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer min-w-[140px]"
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company === "ALL" ? "Toutes les sociétés" : company}
                </option>
              ))}
            </select>
          </div>
          
          {/* Reset Filters button (Visible only if filtered) */}
          {(selectedRole !== "ALL" || selectedCompany !== "ALL" || searchTerm !== "") && (
            <button
              onClick={() => {
                setSelectedRole("ALL");
                setSelectedCompany("ALL");
                setSearchTerm("");
              }}
              className="text-xs font-medium text-slate-500 hover:text-red-600 transition underline underline-offset-2"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Utilisateur</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Rôle</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Société</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Statut</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-slate-50/80 transition-colors duration-200"
                >
                  {/* Utilisateur */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar avec initiales */}
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                        {user.fullname.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {user.fullname}
                        </span>
                        <span className="text-xs text-slate-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Rôle */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                      ${
                        user.role === "ADMIN" 
                          ? "bg-purple-50 text-purple-700 border-purple-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }
                    `}>
                      <Shield size={12} className={user.role === "ADMIN" ? "fill-purple-300" : "fill-blue-300"} />
                      {user.role}
                    </span>
                  </td>

                  {/* Société */}
                  <td className="px-6 py-4">
                    {user.company ? (
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                          <Building2 size={14} />
                        </div>
                        <span className="font-medium">{user.company.name}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs italic">
                        <Briefcase size={12} />
                        Indépendant
                      </span>
                    )}
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      {user.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {user.isActive ? "Actif" : "Inactif"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      <div className="group/tooltip relative">
                        <button
                          onClick={() => router.push(`/super-admin/users/${user.id}/details`)}
                          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => router.push(`/super-admin/users/${user.id}/edit`)}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300 hover:shadow-sm transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
  onClick={() => handleDelete(user.id)}
  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500
             hover:text-red-600 hover:border-red-300 hover:shadow-sm transition-all"
>
  <Trash size={16} />
</button>

                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Filter size={48} className="mb-4 text-slate-200" />
                      <p className="text-lg font-medium text-slate-600">Aucun résultat trouvé</p>
                      <p className="text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
                      <button 
                        onClick={() => {
                          setSelectedRole("ALL");
                          setSelectedCompany("ALL");
                          setSearchTerm("");
                        }}
                        className="mt-4 text-indigo-600 hover:underline text-sm font-medium"
                      >
                        Effacer les filtres
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer du tableau (Pagination placeholder) */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
           <span>Affichage de {filteredUsers.length} utilisateurs</span>
           {/* Placeholder pour pagination future */}
           <div className="flex gap-1 opacity-50 cursor-not-allowed">
             <span className="px-2 py-1 rounded border border-slate-200 bg-white">Précédent</span>
             <span className="px-2 py-1 rounded border border-slate-200 bg-white">Suivant</span>
           </div>
        </div>
      </div>
    </div>
  );
}