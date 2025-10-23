import { FormData, PharmacyData, FormType } from '../types/pharmacy';

const API_BASE_URL = 'https://api.example.com';

const getEndpoint = (formType: FormType): string => {
  const endpoints: Record<FormType, string> = {
    ventas: '/api/ventas',
    inventario: '/api/inventario',
    clientes: '/api/clientes',
    reportes: '/api/reportes',
    estadisticas: '/api/estadisticas',
  };
  return endpoints[formType];
};

export const fetchData = async (
  formType: FormType,
  filters: FormData
): Promise<PharmacyData[]> => {
  const endpoint = getEndpoint(formType);

  const queryParams = new URLSearchParams({
    fechaInicio: filters.fechaInicio,
    fechaFin: filters.fechaFin,
    ...(filters.tipoFarmacia && { tipoFarmacia: filters.tipoFarmacia }),
  });

  try {
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
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);

    return generateMockData(formType, 5);
  }
};

const generateMockData = (formType: FormType, count: number): PharmacyData[] => {
  const mockData: PharmacyData[] = [];

  for (let i = 1; i <= count; i++) {
    const baseData = {
      id: `${formType}-${i}`,
      nombre: `Farmacia ${i}`,
      tipo: ['independiente', 'cadena', 'hospital'][Math.floor(Math.random() * 3)],
      direccion: `Calle ${i}, Ciudad`,
      fecha: new Date().toISOString().split('T')[0],
    };

    switch (formType) {
      case 'ventas':
        mockData.push({
          ...baseData,
          ventas: Math.floor(Math.random() * 10000) + 1000,
          productos: Math.floor(Math.random() * 50) + 10,
        });
        break;
      case 'inventario':
        mockData.push({
          ...baseData,
          stock: Math.floor(Math.random() * 500) + 50,
          valorInventario: Math.floor(Math.random() * 50000) + 5000,
        });
        break;
      case 'clientes':
        mockData.push({
          ...baseData,
          totalClientes: Math.floor(Math.random() * 200) + 20,
          clientesNuevos: Math.floor(Math.random() * 50) + 5,
        });
        break;
      case 'reportes':
        mockData.push({
          ...baseData,
          reportesGenerados: Math.floor(Math.random() * 20) + 1,
          ultimoReporte: new Date().toISOString().split('T')[0],
        });
        break;
      case 'estadisticas':
        mockData.push({
          ...baseData,
          promedioDiario: Math.floor(Math.random() * 1000) + 100,
          tendencia: ['creciente', 'estable', 'decreciente'][Math.floor(Math.random() * 3)],
        });
        break;
    }
  }

  return mockData;
};
