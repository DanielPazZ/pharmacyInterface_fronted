interface DataTableProps {
  // data: PharmacyData[];
  data: Array<Record<string, any>>;
  columns: string[];
}

export default function DataTable({ data }: DataTableProps) {
  const  columns = Object.keys(data[0] ?? {});
  console.log('DataTable data:', data);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No hay datos para mostrar. Realiza una búsqueda para ver los resultados.</p>
      </div>
    );
  }

    const formatCellValue = (value: any, column: string): string => {
        if (typeof value === 'string' && column.toLowerCase().includes('fecha')) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    const options: Intl.DateTimeFormatOptions = { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',      // Añade la hora (ej: 08)
                        minute: '2-digit',    // Añade los minutos (ej: 30)
                        hour12: true,         // Usa formato AM/PM (puedes cambiarlo a false si prefieres 24h)
                    };
                    return date.toLocaleDateString('es-ES', options);
                }
            } catch (e) {
                // Si la conversión falla, simplemente devuelve el valor original
            }
        }
        
        // 3. Valor por defecto si no es una fecha
        return String(value ?? '-');
    };


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {formatCellValue(row[column], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold">{data.length}</span> resultado{data.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
