import { useState } from 'react';
import { Search } from 'lucide-react';
import { FormData } from '../types/pharmacy';

interface SearchFormProps {
  onSearch: (data: FormData) => void;
  isLoading: boolean;
}

const tiposFarmacia = [
  { value: '2', label: 'Almacen Especializado - Sismed' },
  { value: '3', label: 'Almacen Especializado - Donaciones' },
  { value: '4', label: 'Farmacia Principal - Sismed' },
  { value: '5', label: 'Farmacia Principal - Donaciones' },
  { value: '6', label: 'Farmacia Consultorios Externos - Sismed' },
  { value: '7', label: 'Farmacia Quirurgica - Sismed' },
  { value: '8', label: 'Farmacia Emergencia - Sismed' },
  { value: '9', label: 'Farmacia Emergencia - Donaciones' },
  { value: '10', label: 'Otros Servicios del Hospital' },
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fechaInicio: '',
    fechaFin: '',
    almacenId: '4',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="fechaFin" className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="almacenId" className="block text-sm font-semibold text-gray-700 mb-2">
            Farmacia o Almacén
          </label>
          <select
            id="almacenId"
            name="almacenId"
            value={formData.almacenId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            {tiposFarmacia.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Buscar
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
