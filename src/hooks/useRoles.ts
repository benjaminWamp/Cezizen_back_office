// src/hooks/useRoles.ts
import { useState } from 'react';
import { RoleType, RoleAddType, RolesType } from '../types/role';

interface UseRolesReturn {
  roles: RolesType;
  loading: boolean;
  error: Error | null;
  fetchRoles: () => Promise<void>;
  createRole: (newRole: Omit<RoleType, 'id'>) => Promise<void>;
  updateRole: (id: string, updatedFields: Partial<RoleType>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

const useRoles = (): UseRolesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [roles, setRoles] = useState<RolesType>({
    data: [],
  message: '',
});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des citoyens
  const fetchRoles = async () => {    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/role`);      
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: RolesType = await res.json();
      setRoles(data);
    } catch (err: any) {      
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau citoyen
  const createRole = async (newRole: Omit<RoleType, 'id'>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdRole: RoleAddType = await res.json();
      setRoles((prev) => ({data: [...prev.data, createdRole.data], message: createdRole.message}));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour un citoyen
  const updateRole = async (id: string, updatedFields: Partial<RoleType>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/role/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedRole: RoleAddType = await res.json();
      setRoles((prev) => ({data: prev.data.map((role) => (role.id === id ? updatedRole.data : role)), message: updatedRole.message}));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer un citoyen
  const deleteRole = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/role/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedRole : Omit<RoleAddType, 'data'> = await res.json();
      setRoles((prev) => ({data: prev.data.filter((role) => role.id !== id), message: messageDeletedRole.message}));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  };
};

export default useRoles;
