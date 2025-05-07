// src/hooks/useCategory.ts
import { useState } from 'react';
import { CategoriesType, CategoryAddType, CategoryType } from '../types/category';

interface UseCategoriesReturn {
  categories: CategoriesType;
  loading: boolean;
  error: Error | null;
  fetchCategories: () => Promise<void>;
  createCategory: (newCategory: Omit<CategoryType, 'id'>) => Promise<void>;
  updateCategory: (id: string, updatedFields: Partial<CategoryType>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const useCategory = (): UseCategoriesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [categories, setCategories] = useState<CategoriesType>({
    data: [],
    message: '',
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des catégories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${baseUrl}/category`
      );
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: CategoriesType = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle catégorie
  const createCategory = async (newCategory: Omit<CategoryType, 'id'>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdCategory: CategoryAddType = await res.json();
      setCategories((prev) => ({
        data: [...prev.data, createdCategory.data],
        message: createdCategory.message,
        total: prev.total + 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Mettre à jour une catégorie
  const updateCategory = async (id: string, updatedFields: Partial<CategoryType>) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/category/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedCategory: CategoryAddType = await res.json();
      setCategories((prev) => ({
        data: prev.data.map((category) => (category.id === id ? updatedCategory.data : category)),
        message: updatedCategory.message,
        total: prev.total,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/category/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedCategory: Omit<CategoryAddType, 'data'> = await res.json();
      setCategories((prev) => ({
        data: prev.data.filter((category) => category.id !== id),
        message: messageDeletedCategory.message,
        total: prev.total - 1,
      }));
    } catch (err: any) {
      setError(err);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategory;
