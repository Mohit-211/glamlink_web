"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, LayoutGrid, Scissors, Sparkles, Syringe, type LucideIcon } from "lucide-react";
import type { ProfessionalType, ProfessionalTypeId } from "@/lib/directory";
import { directoryThemeStyle } from "./directoryTheme";

/** Radix Select can't use "" as an item value, so "all" stands in for no filter. */
const ALL_VALUE = "all";

const TYPE_ICONS: Partial<Record<ProfessionalTypeId, LucideIcon>> = {
  esthetician: Sparkles,
  "med-spa": Syringe,
  "hair-stylist": Scissors,
};

/** New categories without a mapped icon fall back to Sparkles. */
const iconFor = (id: ProfessionalTypeId | "") => (id ? TYPE_ICONS[id] ?? Sparkles : LayoutGrid);

interface ProfessionalTypeSelectProps {
  professionalTypes: ProfessionalType[];
  value: ProfessionalTypeId | "";
  onChange: (value: ProfessionalTypeId | "") => void;
}

interface OptionProps {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

function Option({ value, label, description, icon: Icon }: OptionProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="group relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2.5 pr-10 outline-none transition-colors data-[highlighted]:bg-primary/[0.07] data-[state=checked]:bg-primary/10"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-data-[highlighted]:bg-white group-data-[highlighted]:text-primary group-data-[state=checked]:bg-primary group-data-[state=checked]:text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <SelectPrimitive.ItemText>
          <span className="block text-sm font-semibold text-foreground">{label}</span>
        </SelectPrimitive.ItemText>
        <span className="block truncate text-xs text-muted-foreground">{description}</span>
      </span>
      <SelectPrimitive.ItemIndicator className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export default function ProfessionalTypeSelect({
  professionalTypes,
  value,
  onChange,
}: ProfessionalTypeSelectProps) {
  const selected = professionalTypes.find((type) => type.id === value);
  const TriggerIcon = iconFor(value);

  return (
    <SelectPrimitive.Root
      value={value || ALL_VALUE}
      onValueChange={(next) => onChange(next === ALL_VALUE ? "" : (next as ProfessionalTypeId))}
    >
      <SelectPrimitive.Trigger
        aria-label="Professional type"
        className="group flex w-full items-center gap-3 rounded-2xl md:rounded-full px-4 py-2.5 md:py-2 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=open]:bg-muted/60"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <TriggerIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Professional Type
          </span>
          {/* Rendered manually so the trigger shows only the label, not the option's description. */}
          <span aria-hidden="true" className="block truncate text-sm sm:text-[15px] font-medium text-foreground">
            {selected?.label ?? "All professionals"}
          </span>
          <span className="sr-only">
            <SelectPrimitive.Value />
          </span>
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary"
            aria-hidden="true"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          side="bottom"
          align="start"
          sideOffset={14}
          collisionPadding={16}
          style={directoryThemeStyle}
          className="z-[60] w-[max(var(--radix-select-trigger-width),20rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border bg-white shadow-large data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <SelectPrimitive.Viewport className="p-2">
            <Option
              value={ALL_VALUE}
              label="All professionals"
              description="Every beauty + wellness category"
              icon={LayoutGrid}
            />
            <SelectPrimitive.Separator className="mx-3 my-1.5 h-px bg-border" />
            {professionalTypes.map((type) => (
              <Option
                key={type.id}
                value={type.id}
                label={type.label}
                description={type.description}
                icon={iconFor(type.id)}
              />
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
