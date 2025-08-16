import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const multiSelectVariants = cva(
  "flex items-center p-1 space-x-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        default: "w-full h-auto min-h-10 rounded-md border border-gray-200 bg-background",
        chip: "w-full h-10 rounded-full border border-gray-200 bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const MultiSelect = React.forwardRef(
  (
    {
      className,
      variant,
      options = [],
      value = [],
      onChange,
      placeholder = "Select options",
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle selection
    const handleSelect = (selectedValue) => {
      if (value.includes(selectedValue)) {
        onChange(value.filter((v) => v !== selectedValue));
      } else {
        onChange([...value, selectedValue]);
      }
    };

    const handleRemove = (selectedValue, event) => {
      event?.stopPropagation();
      onChange(value.filter((v) => v !== selectedValue));
    };

    // Reset search when opening/closing
    React.useEffect(() => {
      if (!open) {
        setSearchTerm("");
      }
    }, [open]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(
              multiSelectVariants({ variant, className }),
              "cursor-pointer hover:bg-accent/5 transition-colors"
            )}
            onClick={() => setOpen(true)}
            {...props}
          >
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {value.length > 0 ? (
                value.map((val) => {
                  const option = options.find((opt) => opt.value === val);
                  return (
                    <div
                      key={val}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground"
                    >
                      {option ? option.label : val}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-4 h-4 hover:bg-secondary/80 rounded-full"
                        onClick={(e) => handleRemove(val, e)}
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown 
              className={cn(
                "h-4 w-4 opacity-50 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] border-gray-200 p-0">
          <div className="flex items-center border-b px-3">
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };