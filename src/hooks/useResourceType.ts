// src/hooks/useResourceType.ts
import { useState } from 'react';
import { ResourceTypeType, ResourceAddType, ResourcesType } from '../types/resourceTypeType';

interface UseResourcesTypeReturn {
  resourcesType: ResourcesType;
  loading: boolean;
  error: Error | null;
  fetchResourcesType: () => Promise<void>;
  createResourceType: (newResourceType: Omit<ResourceTypeType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateResourceType: (id: number, updatedFields: Partial<ResourceTypeType>) => Promise<void>;
  deleteResourceType: (id: number) => Promise<void>;
}

const useResourcesType = (): UseResourcesTypeReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [resourcesType, setResourcesType] = useState<ResourcesType>({
    data: [],
    message: '',
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer les resourcesType
  const fetchResourcesType = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/ressource-type`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ResourcesType = await res.json();
      setResourcesType(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Créer une resourceType
  const createResourceType = async (newResourceType: Omit<ResourceTypeType, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/ressource-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResourceType),
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdResourceType: ResourceAddType = await res.json();
      setResourcesType((prev) => ({
        data: [...prev.data, createdResourceType.data],
        message: createdResourceType.message,
        total: prev.total + 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour une resourceType
  const updateResourceType = async (id: number, updatedFields: Partial<ResourceTypeType>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/ressource-type/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedResourceType: ResourceAddType = await res.json();
      setResourcesType((prev) => ({
        data: prev.data.map((r) => (r.id === id ? updatedResourceType.data : r)),
        message: updatedResourceType.message,
        total: prev.total,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer une resourceType
  const deleteResourceType = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/ressource-type/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedResourceType: Omit<ResourceAddType, 'data'> = await res.json();
      setResourcesType((prev) => ({
        data: prev.data.filter((r) => r.id !== id),
        message: messageDeletedResourceType.message,
        total: prev.total - 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    resourcesType,
    loading,
    error,
    fetchResourcesType,
    createResourceType,
    updateResourceType,
    deleteResourceType,
  };
};

export default useResourcesType;
