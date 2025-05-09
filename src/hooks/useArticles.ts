// src/hooks/useArticles.ts
import { useState } from 'react';
import { ArticleAddType, ArticlesType, ArticleType } from '../types/article';

interface UseArticlesReturn {
  articles: ArticlesType;
  article: ArticleType | null;
  loading: boolean;
  error: Error | null;
  fetchArticles: ({page, perPage}: {page?: number, perPage?: number}) => Promise<void>;
  fetchArticle: (id: number) => Promise<ArticleType>;
  createArticle: (newArticle: Omit<ArticleType, 'id'>) => Promise<ArticleType>;
  updateArticle: (id: number, updatedFields: Partial<ArticleType>) => Promise<ArticleType>;
  deleteArticle: (id: number) => Promise<void>;
  updateArticleImage: (id: number, image: File) => Promise<ArticleType>;
  removeArticleImage: (articleId: number, imageId: number) => Promise<void>;
}

const useArticles = (): UseArticlesReturn => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [articles, setArticles] = useState<ArticlesType>({
    data: [],
  message: '',
    total: 0});
    const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer la liste des citoyens
  const fetchArticles = async ({page, perPage}: {page?: number, perPage?: number}) => {    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${page && perPage ? baseUrl + "/Article" + `?page=${page}&perPage=${perPage}` : baseUrl + "/Article"}`);      
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ArticlesType = await res.json();
      setArticles(data);
    } catch (err: any) {      
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = async (id: number): Promise<ArticleType> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Article/${id}`);
      if (!res.ok) throw new Error(`Erreur lors du chargement : ${res.status}`);
      const data: ArticleAddType = await res.json();
      setArticle(data.data);
      return data.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau citoyen
  const createArticle = async (newArticle: Omit<ArticleType, 'id'>): Promise<ArticleType> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Article`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      if (!res.ok) throw new Error(`Erreur lors de la création : ${res.status}`);
      const createdArticle: ArticleAddType = await res.json();
      setArticles((prev) => ({data: [...prev.data, createdArticle.data], message: createdArticle.message, total: prev.total + 1}));
      return createdArticle.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Mettre à jour un citoyen
  const updateArticle = async (id: number, updatedFields: Partial<ArticleType>): Promise<ArticleType> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Article/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour : ${res.status}`);
      const updatedArticle: ArticleAddType = await res.json();
      setArticles((prev) => ({data: prev.data.map((article) => (article.id === id ? updatedArticle.data : article)), message: updatedArticle.message, total: prev.total}));
      return updatedArticle.data;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Supprimer un citoyen
  const deleteArticle = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Article/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression : ${res.status}`);
      const messageDeletedArticle : Omit<ArticleAddType, 'data'> = await res.json();
      setArticles((prev) => ({data: prev.data.filter((article) => article.id !== id), message: messageDeletedArticle.message, total: prev.total - 1}));
    } catch (err: any) {
      setError(err);
    }
  };

  const updateArticleImage = async (id: number, file: File): Promise<ArticleType> => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const res = await fetch(`${baseUrl}/article-image/${id}/image`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error(`Erreur lors de la mise à jour de l'image : ${res.status}`);
      const updatedArticle: ArticleAddType = await res.json();
      setArticles((prev) => ({data: prev.data.map((article) => (article.id === id ? updatedArticle.data : article)), message: updatedArticle.message, total: prev.total}));
      return updatedArticle.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const removeArticleImage = async (articleId: number, imageId: number): Promise<void> => {
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/article-image/${articleId}/${imageId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Erreur lors de la suppression de l'image : ${res.status}`);
      const result = await res.json(); 

      setArticle((prev) => {
        if (!prev || prev.id !== articleId) return prev;
        return {
          ...prev,
          // on retire de l'array articleImages l'image supprimée
          articleImages: prev.articleImages.filter((img) => img.id !== imageId),
        };
      });

      // Mettre à jour la liste des articles
      setArticles((prev) => ({
        ...prev,
        data: prev.data.map((art) =>
          art.id === articleId
            ? {
                ...art,
                articleImages: art.articleImages.filter((img) => img.id !== imageId),
              }
            : art
        ),
      }));
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return {
    articles,
    article,
    loading,
    error,
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    updateArticleImage,
    removeArticleImage,
  };
};

export default useArticles;
