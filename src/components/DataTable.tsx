import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  createColumnHelper,
  Column,
  Table,
  SortingState, // 💡 Tipo para el ordenamiento
  ColumnFiltersState, // 💡 Tipo para los filtros (La solución principal)
} from '@tanstack/react-table';

function Filter({ column, table }: { column: Column<any, any>; table: Table<any> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Buscar...`}
      className="w-full border-gray-300 rounded-md shadow-sm text-xs p-1 mt-1 text-gray-800"
    />
  );
}

interface DataTableProps {
  data: Array<Record<string, any>>;
}

const columnHelper = createColumnHelper<Record<string, any>>();


export default function DataTable({ data }: DataTableProps) {

  // Estado para manejar el ordenamiento global
  const [sorting, setSorting] = useState([]);
  // Estado para manejar los filtros de columna
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const dataKeys = Object.keys(data[0] ?? {});
  console.log('DataTable data:', data);

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

    // // Formato para números grandes (ej: ventas, inventario)
    // if (typeof value === 'number' && value > 1000) {
    //       return new Intl.NumberFormat('es-ES').format(value);
    // }

    return String(value ?? '-');
  };

  // 3. Generación Dinámica de Columnas con useMemo
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    // Genera la definición de cada columna a partir de las claves
    return dataKeys.map((key) =>
      columnHelper.accessor(key, {
        header: key.toUpperCase(), // Título de la cabecera
        enableSorting: true,
        enableColumnFilter: true,

        // Definición de la celda (donde aplicamos el formato)
        cell: info => {
          return formatCellValue(info.getValue(), key);
        }
      })
    );

  }, [dataKeys]);

  // 4. Inicializar TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting as any,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // 💡 Habilitar redimensionamiento (propiedades adicionales)
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No hay datos para mostrar. Realiza una búsqueda para ver los resultados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="overflow-x-auto">
        {/* Aplicamos un ancho mínimo para que el redimensionamiento funcione */}
        <table
          className="min-w-full" // Asegura que ocupe al menos el 100%
          style={{ width: table.getTotalSize() > 0 ? table.getTotalSize() : '100%' }} // Si hay redimensionamiento, usa el tamaño total; sino, usa 100%
        >
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider relative" // relative es clave para el redimensionador
                    style={{ width: header.getSize() }} // 💡 Ancho dinámico
                  >
                    <div
                      // 💡 Lógica de Ordenamiento al hacer click
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* Indicador de ordenación */}
                      {{
                        asc: '🔼',
                        desc: '🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>

                    {/* 💡 Input de Filtro */}
                    {header.column.getCanFilter() ? (
                      <Filter column={header.column} table={table} />
                    ) : null}

                    {/* 💡 Manejador de Redimensionamiento (el "borde" que arrastras) */}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none ${header.column.getIsResizing() ? 'bg-indigo-500 opacity-50' : ''
                        }`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700"
                    style={{ width: cell.column.getSize() }} // 💡 Ancho de la celda
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold">{table.getRowModel().rows.length}</span> resultado{table.getRowModel().rows.length !== 1 ? 's' : ''} (Total: {data.length})
        </p>
      </div>
    </div>
  );
}
