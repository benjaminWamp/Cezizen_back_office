import useCategories from "../hooks/useCategory";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { CategoryType } from "../types/category";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import { useDebounce } from "../hooks/useDebounce";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { FormSchema } from "../validation/categoryValidation";

import { useUser } from "@clerk/clerk-react";
import useCitizens from "../hooks/useCitizens";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Nom", width: 130 },
  { field: "description", headerName: "Description", width: 750 },
];

const Index = () => {
  const { fetchCitizens, citizens, fetchCitizenActive } = useCitizens();
  const { user } = useUser();


  const { fetchCategories, categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [search, setSearch] = useState<string>("");
  const [categoriesFiltered, setCategoriesFiltered] = useState<CategoryType[]>([]);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 500);

  const createCitizenFormConfig: FieldConfig[] = [
    {
      name: "name",
      label: "Nom",
      type: "text",
      defaultValue: "",
      validation: { required: "Le nom est requis" },
      showOn: "always",
    },
    {
      name: "description",
      label: "Description",
      type: "textArea",
      defaultValue: "",
      validation: { required: "Le nom est requis" },
      showOn: "always",
    },
  ];

      // Récupération du rôle utilisateur et log si USER
      useEffect(() => {
        const fetchUserRole = async () => {
          if (user?.id) {
            try {
              const citizen = await fetchCitizenActive(user.id);
              if (citizen?.role?.name === "USER") {
                console.log("Rôle détecté : USER");
                window.location.href = "/401";
              }
            } catch (error) {
              console.error("Erreur lors de la récupération du citoyen actif :", error);
            }
          }
        };
    
        fetchUserRole();
      }, [user]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.data.filter((c) => `${c.name}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));
    setCategoriesFiltered(filtered);
  }, [debouncedSearch, categories]);

  const handleRowDoubleClick = (rowData: any) => {
    setFormData(rowData);
    setOpen(true);
  };

  const handleSubmitClick = (data: CategoryType) => {
    console.log("Data submitted:", data);
    if (data.id) {
      updateCategory(data.id, data);
    } else {
      createCategory(data);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    deleteCategory(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des catégories" searchValue={search} onAddClick={() => setOpen(true)} onSearchChange={setSearch} />
          <GridComponent
            rows={categoriesFiltered}
            columns={columns}
            loading={loading}
            hideFooter={true}
            onRowDoubleClick={(params) => {
              handleRowDoubleClick(params);
            }}
          />
          <ModalEdition
            open={open}
            onClose={() => handleCloseModal()}
            FormSchema={FormSchema}
            title={formData ? "Modifier une catégorie" : "Créer une catégorie"}
            fields={createCitizenFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
