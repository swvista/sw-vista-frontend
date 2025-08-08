
import * as React from "react";
import { cva } from "class-variance-authority";
import { CheckIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
        default: "w-full h-auto min-h-10 rounded-md border border-input",
        chip: "w-full h-10 rounded-full border border-input",
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
      options,
      value,
      onChange,
      placeholder = "Select options",
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (selectedValue) => {
      if (value.includes(selectedValue)) {
        onChange(value.filter((v) => v !== selectedValue));
      } else {
        onChange([...value, selectedValue]);
      }
    };

    const handleRemove = (selectedValue) => {
      onChange(value.filter((v) => v !== selectedValue));
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(multiSelectVariants({ variant, className }))}
            onClick={() => setOpen(true)}
            {...props}
          >
            <div className="flex flex-wrap items-center gap-1.5">
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
                        className="w-4 h-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(val);
                        }}
                      >
                        <XIcon className="w-3 h-3" />
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
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
