export interface FormDataPreventas {
  fechaInicio: string;
  fechaFin: string;
  almacenId: string;
}
export interface FormDataSaldos {
  almacenId: string;
  codigoMedicamento?: string;
}

export type FormType =
  | 'preventas'
  | 'saldos';

export type FormData = FormDataPreventas | FormDataSaldos;