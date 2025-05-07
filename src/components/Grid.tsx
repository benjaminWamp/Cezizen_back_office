import { DataGrid, GridCallbackDetails, GridColDef, GridRowParams, MuiEvent } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

interface propsGridCompornentType {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  hideFooter?: boolean;
  onRowDoubleClick?: (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails) => void;
}

export default function GridComponent({ rows, columns, loading, hideFooter, onRowDoubleClick }: propsGridCompornentType) {
  return (
    <Paper sx={{ flex: 15, height: "50vh", marginBottom: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        sx={{ border: 0 }}
        localeText={{
          noRowsLabel: "Aucune donnée",
          noResultsOverlayLabel: "Aucun résultat trouvé",
        }}
        loading={loading}
        hideFooter={hideFooter}
        onRowDoubleClick={onRowDoubleClick}
      />
    </Paper>
  );
}
