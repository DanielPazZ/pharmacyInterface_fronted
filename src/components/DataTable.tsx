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
  SortingState,
  ColumnFiltersState,
  getExpandedRowModel,
  ExpandedState,
  getGroupedRowModel,
  FilterFn,
} from '@tanstack/react-table';

import * as XLSX from 'xlsx'; // 💡 Importación de XLSX
import { saveAs } from 'file-saver'; // 💡 Importación de file-saver

const groupFilterFn: FilterFn<any> = (row, columnId, filterValue, addMeta) => {
  const groupValue = row.getValue(columnId);
  const filterText = filterValue.toString().toLowerCase();

  // 1. Si la fila está agrupada (es el encabezado de grupo), buscar en su valor.
  if (row.getIsGrouped()) {
    return groupValue?.toString().toLowerCase().includes(filterText);
  }

  // 2. Si la fila es una fila de detalle, buscar en el valor original.
  return row.original[columnId]?.toString().toLowerCase().includes(filterText);
};


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

const isDetailColumn = (key: string): boolean => {
  const detailKeys = ['Pre-venta','Estado', 'Fecha', 'Vendedor', 'Tipo_Receta'];
  return detailKeys.includes(key);
};

export default function DataTable({ data }: DataTableProps) {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [grouping, setGrouping] = useState(['Pre_Venta']);

  const dataKeys = Object.keys(data[0] ?? {});
  const columnsToRender = dataKeys.filter(key => key !== 'Pre_Venta');

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
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          };
          return date.toLocaleDateString('es-ES', options);
        }
      } catch (e) {
        /* ignore */
      }
    }

    if (typeof value === 'number' && (column.toLowerCase().includes('precio') || column.toLowerCase().includes('importe') || column.toLowerCase().includes('cantidad'))) {
      return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }

    return String(value ?? '-');
  };

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {

    const idColumn = columnHelper.accessor('Pre_Venta', {
      header: 'Pre-Venta',

      enableColumnFilter: true,
      filterFn: groupFilterFn,

      cell: ({ row, getValue }) => {
        if (row.getIsGrouped()) {
          return (
            <div
              onClick={row.getToggleExpandedHandler()}
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              {row.getIsExpanded() ? '➖ ' : '➕ '}
              {getValue()}
              <br></br>
              <span className="text-gray-500 font-normal text-xs ml-2">({row.subRows.length} producto{row.subRows.length !== 1 ? 's' : ''})</span>
            </div>
          );
        }
        // return formatCellValue(getValue(), 'Pre_Venta');
      },
      enableSorting: true,
    });
    // Genera la definición de cada columna a partir de las claves
    const detailColumns = columnsToRender.map((key) =>
      columnHelper.accessor(key, {
        header: key.toUpperCase().replace(/_/g, ' '),
        enableSorting: true,
        enableColumnFilter: true,

        // Definición de la celda (donde aplicamos el formato)
        cell: info => {
          if (info.row.getIsGrouped()) {
            if (isDetailColumn(key)) {
              return formatCellValue(info.row.subRows[0].original[key], key);
            }
            // if (info.row.subRows.length == 1) {
            //   return formatCellValue(info.row.subRows[0].original[key], key);
            // }
            return null;
          }
          if (!isDetailColumn(key)) {
            return formatCellValue(info.getValue(), key);
          }

        }
      })
    );
    return [idColumn, ...detailColumns];

  }, [dataKeys, columnsToRender]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      expanded,
      grouping,
    },
    onSortingChange: setSorting as any,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  const handleDownloadExcel = () => {
    if (data.length === 0) {
      console.error('No hay datos para exportar.');
      return;
    }

    const dataToExport = data;
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    saveAs(dataBlob, `Reporte_Farmacia_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No hay datos para mostrar. Realiza una búsqueda para ver los resultados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex justify-end p-4 border-b border-gray-200">
        <button
          onClick={handleDownloadExcel}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>Descargar Excel</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        {/* Aplicamos un ancho mínimo para que el redimensionamiento funcione */}
        <table
          className="min-w-full"
          style={{ width: table.getTotalSize() > 0 ? table.getTotalSize() : '100%' }}
        >
          <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider relative"
                    style={{ width: header.getSize() }}
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
                className={`hover:bg-gray-50 transition-colors ${row.getIsExpanded() ? 'bg-indigo-50/70' : ''}`} // Resalta filas expandidas
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700"
                    style={{ width: cell.column.getSize() }}
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
          Mostrando <span className="font-semibold">{table.getRowModel().rows.length}</span> fila{table.getRowModel().rows.length !== 1 ? 's' : ''} (Total: {data.length} productos)
        </p>
      </div>
    </div>
  );
}
