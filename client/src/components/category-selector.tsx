import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  layout?: "grid" | "list";
}

export default function CategorySelector({
  selectedCategory,
  onCategoryChange,
  layout = "grid"
}: CategorySelectorProps) {
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, string> = {
      "book": "📚",
      "building": "🏢",
      "users": "👥",
      "chalkboard-teacher": "👨‍🏫",
      "futbol": "⚽"
    };
    return iconMap[iconName] || "📝";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-3">Category *</label>
      <div className={cn(
        layout === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 gap-3" 
          : "space-y-3"
      )}>
        {CATEGORIES.map((category) => (
          <label
            key={category.id}
            className={cn(
              "category-card p-4 sm:p-4 rounded-lg border cursor-pointer transition-all duration-300",
              selectedCategory === category.id
                ? "border-primary bg-primary/5"
                : "border-border bg-accent hover:border-primary"
            )}
            data-testid={`category-${category.id}`}
          >
            <input
              type="radio"
              name="category"
              value={category.id}
              checked={selectedCategory === category.id}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className={cn("h-10 w-10 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center text-white text-lg sm:text-sm flex-shrink-0", category.color)}>
                {getIconComponent(category.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground text-sm sm:text-base block">{category.name}</span>
                <p className="text-sm sm:text-xs text-muted-foreground mt-1 leading-relaxed">{category.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
