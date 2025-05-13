import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-2">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index === items.length - 1 ? (
              <span className="font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
            ) : item.link ? (
              <Link href={item.link} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 