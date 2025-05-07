// src/hooks/useResources.ts
import { useState } from 'react';
import { ResourceAddType, ResourcesType, ResourceType } from '../types/resource';

interface UseResourcesReturn {
  resources: ResourcesType;
  resource: ResourceType | null;
  loading: boolean;
  error: Error | null;
  fetchResources: ({page, perPage}: {page?: number, perPage?: number}) => Promise<void>;
  fetchResource: (id: string) => Promise<ResourceType>;
  createResource: (newResource: Omit<ResourceType, 'id'>) => Promise<ResourceType>;
  updateResource: (id: string, updatedFields: Partial<ResourceType>) => Promise<ResourceType>;
  validateResource: (id: string) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
}

const useResources = (): UseResourcesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [resources, setResources] = useState<ResourcesType>({
    data: [],
  message: '',
    total: 0});
    const [resource, setResource] = useState<ResourceType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des citoyens
  const fetchResources = async ({page, perPage}: {page?: number, perPage?: number}) => {    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${page && perPage ? baseUrl + "/Ressource" + `?page=${page}&perPage=${perPage}` : baseUrl + "/Ressource"}`);      
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ResourcesType = await res.json();
      setResources(data);
    } catch (err: any) {      
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResource = async (id: string): Promise<ResourceType> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Ressource/${id}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ResourceAddType = await res.json();
      setResource(data.data);
      return data.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau citoyen
  const createResource = async (newResource: Omit<ResourceType, 'id'>): Promise<ResourceType> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Ressource`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdResource: ResourceAddType = await res.json();
      setResources((prev) => ({data: [...prev.data, createdResource.data], message: createdResource.message, total: prev.total + 1}));
      return createdResource.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Mettre à jour un citoyen
  const updateResource = async (id: string, updatedFields: Partial<ResourceType>): Promise<ResourceType> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Ressource/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedResource: ResourceAddType = await res.json();
      setResources((prev) => ({data: prev.data.map((resource) => (resource.id.toString() === id ? updatedResource.data : resource)), message: updatedResource.message, total: prev.total}));
      return updatedResource.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Supprimer un citoyen
  const deleteResource = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Ressource/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedResource : Omit<ResourceAddType, 'data'> = await res.json();
      setResources((prev) => ({data: prev.data.filter((resource) => resource.id.toString() !== id), message: messageDeletedResource.message, total: prev.total - 1}));
    } catch (err: any) {
      setError(err);
    }
  };

  const validateResource = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Ressource/validate/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isValidated: true })
      });
      if (!res.ok) throw new Error(`Erreur lors de la validation : ${res.status}`);
      const updatedResource: ResourceAddType = await res.json();
      setResources((prev) => ({data: prev.data.map((resource) => (resource.id.toString() === id ? updatedResource.data : resource)), message: updatedResource.message, total: prev.total}));
      
    } catch (
      err: any) {
      setError(err);
    }
  };

  return {
    resources,
    resource,
    loading,
    error,
    fetchResources,
    fetchResource,
    createResource,
    updateResource,
    validateResource,
    deleteResource
  };
};

export default useResources;
