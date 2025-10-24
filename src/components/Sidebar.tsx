import { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Package, Users, FileText, BarChart3 } from 'lucide-react';
import { FormType } from '../types/pharmacy';

interface SidebarProps {
  currentForm: FormType;
  onFormChange: (form: FormType) => void;
}

const menuItems = [
  { id: 'ventas' as FormType, label: 'Pre Ventas', icon: ShoppingCart },
  // { id: 'inventario' as FormType, label: 'Inventario', icon: Package },
  // { id: 'clientes' as FormType, label: 'Clientes', icon: Users },
  // { id: 'reportes' as FormType, label: 'Reportes', icon: FileText },
  // { id: 'estadisticas' as FormType, label: 'Estadísticas', icon: BarChart3 },
];

export default function Sidebar({ currentForm, onFormChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && <h1 className="text-xl font-bold">Farmacia App</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentForm === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onFormChange(item.id)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  } p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
                      : 'hover:bg-slate-700'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
