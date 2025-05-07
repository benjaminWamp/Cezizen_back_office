import useResources from "../hooks/useResources";
import { useEffect } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import { ResourceType } from "../types/resource";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import ModalEdition, { FieldConfig } from "../components/ModalEdition";
import { useDebounce } from "../hooks/useDebounce";
import useCategory from "../hooks/useCategory";
import useResourcesType from "../hooks/useResourceType";
import { formatISOToDateInput } from "../utils/date";
import { FormSchema } from "../validation/resourceValidation";
import useCitizens from "../hooks/useCitizens";
import { useUser } from "@clerk/clerk-react";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Titre", width: 130 },
  { field: "description", headerName: "Description", width: 130 },
  {
    field: "maxParticipant",
    headerName: "Nombre max de participants",
    width: 250,
  },
  {
    field: "deadLine",
    headerName: "Date limite",
    width: 160,
    valueGetter: (value: Date) => `${new Date(value).toLocaleDateString("fr-FR")}`,
  },
  {
    field: "category",
    headerName: "Categorie",
    width: 160,
    valueGetter: (value: { name: string }) => `${value.name}`,
  },
  {
    field: "isValidate",
    headerName: "Validé ?",
    width: 160,
    valueGetter: (value: boolean) => `${value ? "Oui" : "Non"}`,
  },
  {
    field: "status",
    headerName: "Statut",
    width: 160,
  },
  {
    field: "typeRessource",
    headerName: "Type de ressource",
    width: 160,
    valueGetter: (value: { name: string }) => `${value.name}`,
  },
];

const Index = () => {
  const { fetchCitizenActive } = useCitizens();
  const { user } = useUser();


  const { fetchResources, resources, loading, error, createResource, updateResource, deleteResource, fetchResource, validateResource } = useResources();
  const { fetchCategories, categories } = useCategory();
  const { fetchResourcesType, resourcesType } = useResourcesType();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [resourcesFiltered, setResourcesFiltered] = useState<ResourceType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GridRowParams | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);

  const ressourceFormConfig: FieldConfig[] = [
    { name: "title", label: "Titre", type: "text", validation: { required: "Le titre est requis" }, showOn: "always" },
    { name: "description", label: "Description", type: "textArea", validation: { required: "La description est requise" }, showOn: "always" },
    { name: "maxParticipant", label: "Max participants", type: "number", validation: { min: { value: 1, message: ">=1" } }, showOn: "always" },
    { name: "nbParticipant", label: "Participants actuels", type: "number", validation: { min: { value: 0, message: ">=0" } }, showOn: "always" },
    { name: "deadLine", label: "Date limite", type: "date", validation: {}, showOn: "always" },
    {
      name: "categoryId",
      label: "Catégorie",
      type: "dropdown",
      validation: { required: "La catégorie est requise" },
      showOn: "always",
      options: categories.data.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
    { name: "fileId", label: "Fichier", type: "file", validation: {}, showOn: "create" },
    { name: "bannerId", label: "Bannière", type: "banner", validation: {}, showOn: "create" },
    { name: "isValidate", label: "Validé ?", type: "checkbox", validation: {}, showOn: "edit" },
    {
      name: "typeRessourceId",
      label: "Type de ressource",
      type: "dropdown",
      validation: { required: "Le type est requis" },
      showOn: "always",
      options: resourcesType.data.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    },
  ];

  const debouncedSearch = useDebounce(search, 500);

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
    fetchResourcesType();
  }, []);

  useEffect(() => {
    fetchResources({ page: page, perPage: perPage });
  }, [perPage, page]);

  useEffect(() => {
    const totalCount = Math.ceil(resources.total / perPage);
    setCount(totalCount);
  }, [perPage, resources]);

  useEffect(() => {
    const filtered = resources.data.filter((c) => `${c.title} ${c.description}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));

    setResourcesFiltered(filtered);
  }, [debouncedSearch, resources]);

  const handleRowDoubleClick = async (rowData: any) => {
    await fetchResource(rowData.id).then((resource) => {
      setFormData({
        ...rowData,
        row: {
          ...resource,
          deadLine: resource?.deadLine && formatISOToDateInput(resource.deadLine),
          categoryId: resource.category.id,
          typeRessourceId: resource.typeRessource.id,
        },
      });
    });
    setOpen(true);
  };

  const handleSubmitClick = (data: ResourceType) => {
    if (data.id) {
      const { step, ...rest } = data;
      if (data.isValidate) validateResource(data.id.toString());
      updateResource(data.id.toString(), {
        ...rest,
        nbParticipant: rest.nbParticipant && Number(rest.nbParticipant),
        maxParticipant: rest.maxParticipant && Number(rest.maxParticipant),
        deadLine: rest.deadLine && new Date(rest.deadLine).toISOString(),
      });
    } else {
      createResource({
        ...data,
        nbParticipant: Number(data.nbParticipant),
        maxParticipant: Number(data.maxParticipant),
        deadLine: data.deadLine ? new Date(data.deadLine).toISOString() : new Date().toISOString(),
      });
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    deleteResource(id);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleFileChange = (data: File) => {
    setFile(data);
  };

  const handleBannerChange = (data: File) => {
    setBanner(banner);
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des ressources" onAddClick={() => setOpen(true)} searchValue={search} onSearchChange={setSearch} />
          <GridComponent
            rows={resourcesFiltered}
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
            title={formData ? "Modifier une ressource" : "Créer une ressource"}
            fields={ressourceFormConfig}
            onSubmit={(data) => handleSubmitClick(data)}
            initialData={formData}
            TransitionProps={{ onExited: () => setFormData(null) }}
            onDelete={(id) => {
              handleDeleteClick(id);
            }}
            onSubmitFile={(data) => handleFileChange(data)}
            onSubmitBanner={(data) => handleBannerChange(data)}
            interfaceActive="resource"
          />
        </Box>
      )}
    </Box>
  );
};
export default Index;
