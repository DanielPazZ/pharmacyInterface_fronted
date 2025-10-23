export interface FormData {
  fechaInicio: string;
  fechaFin: string;
  tipoFarmacia: string;
}

export interface PharmacyData {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  ventas: number;
  fecha: string;
  [key: string]: any;
}

export type FormType =
  | 'ventas'
  | 'inventario'
  | 'clientes'
  | 'reportes'
  | 'estadisticas';
