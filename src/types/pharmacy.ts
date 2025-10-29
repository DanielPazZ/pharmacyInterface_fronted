export interface FormData {
  fechaInicio: string;
  fechaFin: string;
  almacenId: string;
}

export type FormType =
  | 'preventas'
  | 'ventas'
  | 'inventario'
  | 'reportes'
  | 'estadisticas';
