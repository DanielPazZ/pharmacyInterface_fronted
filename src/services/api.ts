import { FormData, FormType } from '../types/pharmacy';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getEndpoint = (formType: FormType): string => {
  const endpoints: Record<FormType, string> = {
    preventas: '/preventa',
    ventas: '/api/ventas',
    inventario: '/api/inventario',
    reportes: '/api/reportes',
    estadisticas: '/api/estadisticas',
  };
  return endpoints[formType];
};

export const fetchData = async (
  formType: FormType,
  filters: FormData
): Promise<[]> => {
// ): Promise<PharmacyData[]> => {
  const endpoint = getEndpoint(formType);

  const queryParams = new URLSearchParams({
    fechaInicio: filters.fechaInicio,
    fechaFin: filters.fechaFin,
    ...(filters.tipoFarmacia && { tipoFarmacia: filters.tipoFarmacia }),
  });

  try {
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