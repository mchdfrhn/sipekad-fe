import { motion as Motion } from 'motion/react';
import { FileX, Search, Inbox } from 'lucide-react';

/**
 * EmptyState — consistent empty state for tables and lists
 * Props: title, description, icon (lucide component), action (JSX node), variant ('search'|'data'|'inbox')
 */
const EmptyState = ({
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia saat ini.',
  icon: CustomIcon,
  action,
  variant = 'data',
}) => {
  const icons = { data: FileX, search: Search, inbox: Inbox };
  const Icon = CustomIcon || icons[variant] || FileX;

  const bgColors = {
    data: 'bg-gray-50',
    search: 'bg-indigo-50',
    inbox: 'bg-blue-50',
  };
  const iconColors = {
    data: 'text-gray-300',
    search: 'text-indigo-300',
    inbox: 'text-blue-300',
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className={`h-20 w-20 rounded-3xl ${bgColors[variant]} flex items-center justify-center mb-5`}>
        <Icon className={`h-10 w-10 ${iconColors[variant]}`} />
      </div>
      <h3 className="text-base font-bold text-[#2B3674] mb-1">{title}</h3>
      <p className="text-sm text-[#718096] max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </Motion.div>
  );
};

export default EmptyState;
