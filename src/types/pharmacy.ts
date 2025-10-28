export interface FormData {
  fechaInicio: string;
  fechaFin: string;
  tipoFarmacia: string;
}

export type FormType =
  | 'preventas'
  | 'ventas'
  | 'inventario'
  | 'reportes'
  | 'estadisticas';
