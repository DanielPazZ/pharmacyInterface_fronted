import { useState } from 'react';
import Sidebar from './components/Sidebar';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import { FormData, FormType } from './types/pharmacy';
import { fetchData } from './services/api';

const formTitles: Record<FormType, string> = {
  preventas: 'Reporte de Pre-Ventas',
  ventas: 'Reporte de Ventas',
  inventario: 'Control de Inventario',
  reportes: 'Reportes Generados',
  estadisticas: 'Estadísticas Generales',
};

function App() {
  const [currentForm, setCurrentForm] = useState<FormType>('preventas');
  // const [data, setData] = useState<PharmacyData[]>([]);
  const [data, setData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await fetchData(currentForm, formData);
      setData(result);
    } catch (error) {
      console.error('Error al buscar datos:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (form: FormType) => {
    setCurrentForm(form);
    setData([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentForm={currentForm} onFormChange={handleFormChange} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {formTitles[currentForm]}
            </h2>
            <p className="text-gray-600">
              Utiliza los filtros para buscar y visualizar la información
            </p>
          </div>

          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          <DataTable
            data={data}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
