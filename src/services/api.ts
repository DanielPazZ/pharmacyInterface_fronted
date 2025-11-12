import { FormData, FormType, FormDataSaldos, FormDataPreventas } from '../types/pharmacy';
const API_BASE_URL = 'http://127.0.0.1:8000';

const getEndpoint = (formType: FormType): string => {
  const endpoints: Record<FormType, string> = {
    preventas: '/preventa',
    saldos: '/saldos',
  };
  return endpoints[formType];
};

export const fetchData = async (
  formType: FormType,
  filters: FormData
): Promise<[]> => {
  // ): Promise<PharmacyData[]> => {
  const endpoint = getEndpoint(formType);
  const params = new URLSearchParams();

  if (formType === 'saldos') {
    const saldosFilters = filters as FormDataSaldos;

    params.append('almacenId', saldosFilters.almacenId);
    if (saldosFilters.codigoMedicamento) {
      params.append('codigoMedicamento', saldosFilters.codigoMedicamento);
    }

  } else if (formType === 'preventas') {
    const preventasFilters = filters as FormDataPreventas;
    params.append('fechaInicio', preventasFilters.fechaInicio);
    params.append('fechaFin', preventasFilters.fechaFin);

    if (preventasFilters.almacenId) {
      params.append('almacenId', preventasFilters.almacenId);
    }
  }
  try {
    const queryParams = params.toString();
    // console.log('Fetch URL:', `${API_BASE_URL}${endpoint}?${queryParams}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('data:', `${data}`);
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};