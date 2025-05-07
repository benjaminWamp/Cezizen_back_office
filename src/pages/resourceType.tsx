import useTypeResources from "../hooks/useResourceType";
import { useEffect } from "react";
import { Box } from "@mui/material";
import GridComponent from "../components/Grid";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { ResourceTypeType } from "../types/resourceTypeType";
import ErrorComponent from "../components/Error";
import HeaderGrid from "../components/HeaderGrid";
import { useDebounce } from "../hooks/useDebounce";
import { useUser } from "@clerk/clerk-react";
import useCitizens from "../hooks/useCitizens";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Nom", width: 130 },
];

const Index = () => {
  const { fetchCitizenActive } = useCitizens();
  const { user } = useUser();


  const { fetchResourcesType, resourcesType, loading, error } = useTypeResources();
  const [search, setSearch] = useState<string>("");
  const [typeResourcesFiltered, setCitiensFiltered] = useState<ResourceTypeType[]>([]);

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
    fetchResourcesType();
  }, []);

  useEffect(() => {
    const filtered = resourcesType.data.filter((c) => `${c.name}`.toLowerCase().includes(debouncedSearch.trim().toLowerCase()));
    setCitiensFiltered(filtered);
  }, [debouncedSearch, resourcesType]);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
      {error && <ErrorComponent errorMessage={error?.message} />}
      {!loading && !error && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <HeaderGrid title="Liste des types de ressources" searchValue={search} onSearchChange={setSearch} />
          <GridComponent rows={typeResourcesFiltered} columns={columns} loading={loading} hideFooter={true} onRowDoubleClick={(params) => {}} />
        </Box>
      )}
    </Box>
  );
};
export default Index;
