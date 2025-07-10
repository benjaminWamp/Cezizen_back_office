import useArticles from "../hooks/useArticles";
import { useEffect } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import { ArticleType } from "../types/article";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import useCategory from "../hooks/useCategory";
import { FormSchema } from "../validation/articleValidation";
import useCitizens from "../hooks/useUsers";
import { useUser } from "@clerk/clerk-react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "label", headerName: "Titre", width: 130 },
  { field: "description", headerName: "Description", width: 300 },
  {
    field: "content",
    headerName: "Contenu",
    width: 1000,
  },
  {
    field: "category",
    headerName: "Categorie",
    width: 160,
    valueGetter: (value: { label: string }) => `${value.label}`,
  },
  {
    field: "user",
    headerName: "Auteur",
    width: 160,
    valueGetter: (value: { firstname: string; lastname: string }) => `${value && value.firstname && value.lastname ? value.firstname + value.lastname : "--"}`,
  },
  {
    field: "articleImages",
    headerName: "Image",
    width: 200,
    valueGetter: (params: any) => {
      return params && params.length > 0 ? params[0].path.slice(24) : "";
    },
  },
];

const Index = () => {
  const { fetchUserActive } = useCitizens();
  const { user } = useUser();

  const { fetchArticles, articles, loading, error, createArticle, updateArticle, deleteArticle, fetchArticle, updateArticleImage, removeArticleImage } =
    useArticles();
  const { fetchUsers, users } = useCitizens();
  const { fetchCategories, categories } = useCategory();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [articlesFiltered, setArticlesFiltered] = useState<ArticleType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [deleteImage, setDeleteImage] = useState<boolean>(false);

  const articleFormConfig: FieldConfig[] = [
    { name: "label", label: "Titre", type: "text", showOn: "always" },
    { name: "description", label: "Description", type: "textArea", showOn: "always" },
    { name: "content", label: "Contenue", type: "textArea", showOn: "always" },
    {
      name: "userId",
      label: "Auteur",
      type: "dropdown",
      showOn: "always",
      options: users.data.map((user) => ({
        label: `${user.firstname} ${user.lastname}`,
        value: user.id,
      })),
    },
    {
      name: "categoryId",
      label: "Catégorie",
      type: "dropdown",
      validation: { required: "La catégorie est requise" },
      showOn: "always",
      options: categories.data.map((cat) => ({
        value: cat.id,
        label: cat.label,
      })),
    },
    { name: "images", label: "Image", type: "image", showOn: "always" },
  ];

  const debouncedSearch = useDebounce(search, 500);

  // Récupération du rôle utilisateur et log si USER
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        try {
          const userActive = await fetchUserActive(user.id);
          if (userActive?.role?.name === "USER") {
            window.location.href = "/401";
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur actif :", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    fetchUsers({ page: 1, perPage: 100 });
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles({ page: page, perPage: perPage });
  }, [perPage, page]);

  useEffect(() => {
    const totalCount = Math.ceil(articles.total / perPage);
    setCount(totalCount);
  }, [perPage, articles]);

  useEffect(() => {
    const filtered = articles.data.filter((c: ArticleType) =>
      `${c.label} ${c.description} ${c.content}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );

    setArticlesFiltered(filtered);
  }, [debouncedSearch, articles]);

  const handleRowDoubleClick = async (rowData: any) => {
    await fetchArticle(rowData.id).then((article: ArticleType) => {
      setFormData({
        ...rowData,
        row: {
          ...article,
          categoryId: article.category.id,
          userId: article.user?.id ?? null,
        },
      });
    });
    setOpen(true);
  };

  const handleSubmitClick = (data: ArticleType) => {
    if (data.id) {
      const { ...rest } = data;
      updateArticle(data.id, rest).then((article: ArticleType) => {
        if (file) {
          updateArticleImage(article.id, file);
          setFile(null);
        } else if (deleteImage && formData && formData.row.articleImages.length > 0) {
          removeArticleImage(article.id, formData.row.articleImages[0].id);
          setFile(null);
        }
      });
    } else {
      createArticle({
        ...data,
      }).then((article: ArticleType) => {
        if (file) {
          updateArticleImage(article.id, file);
          setFile(null);
        }
      });
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
    deleteArticle(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleImageChange = (data: File) => {
    setFile(data);
  };

  const handlerDeleteImage = (isDeleteImage: boolean) => {
    setFile(null);
    setDeleteImage(isDeleteImage);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des articles" onAddClick={() => setOpen(true)} searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows={articlesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "flex", flexDirection: "row" }}>
              <InputLabel variant="outlined">Ligne par page</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={perPage}
                label="Ligne par page"
                sx={{ width: "100%" }}
                onChange={(data: any) => {
                  setPerPage(parseInt(data.target.value));
                  setPage(1);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={page === 1}
              >
                -
              </Button>
              <Typography>
                {page} sur {count}
              </Typography>
              <Button
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={page === count}
              >
                +
              </Button>
            </Box>
          </Box>
          <ModalEdition
            open={open}
            FormSchema={FormSchema}
            onClose={() => handleCloseModal()}
            title={formData ? "Modifier un article" : "Créer un article"}
            fields={articleFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
            onSubmitImage={(data) => handleImageChange(data)}
            interfaceActive="article"
            onDeleteImage={(isDeleteImage: boolean) => handlerDeleteImage(isDeleteImage)}
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
