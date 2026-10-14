import { categoryClass } from '../../constants/toolsCatalog';
import ToolIcon from './ToolIcon';

const SIZES = {
  sm: 'h-8 w-8 rounded-[10px] [&_svg]:h-[18px] [&_svg]:w-[18px]',
  md: 'h-11 w-11 rounded-[14px] [&_svg]:h-6 [&_svg]:w-6',
  lg: 'h-16 w-16 rounded-[20px] [&_svg]:h-9 [&_svg]:w-9',
};

/** Solid category-coloured icon tile for a tool. */
export default function ToolMark({ tool, size = 'md', className = '' }) {
  return (
    <span
      className={`${categoryClass(tool)} inline-flex shrink-0 items-center justify-center bg-accent-500 text-white ${SIZES[size]} ${className}`}
      aria-hidden="true"
    >
      <ToolIcon name={tool.icon} />
    </span>
  );
}
