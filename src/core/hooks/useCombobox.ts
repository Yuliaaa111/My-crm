import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import type { ComboboxOptionType } from "@/core/types";
import { matchesSearchQuery } from "@/core/utils/matchesSearchQuery";

type UseComboboxParamsType = {
  options: ComboboxOptionType[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

const NO_ACTIVE_INDEX = -1;

const KEYS = {
  down: "ArrowDown",
  up: "ArrowUp",
  enter: "Enter",
  escape: "Escape",
  home: "Home",
  end: "End",
};

// Keyboard and ARIA behaviour follows the WAI-ARIA "combobox with listbox
// popup" pattern: focus stays in the input, the highlighted option is
// announced through aria-activedescendant.
export const useCombobox = ({
  options,
  value,
  onChange,
  onBlur,
}: UseComboboxParamsType) => {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  // null means the user has not typed anything yet: the input shows the
  // selected option and the whole list is offered.
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_INDEX);
  const optionElements = useRef(new Map<string, HTMLLIElement>());

  const selectedOption = options.find((option) => option.value === value);
  const visibleOptions =
    searchQuery === null
      ? options
      : options.filter(({ searchValues }) =>
          matchesSearchQuery(searchValues, searchQuery),
        );
  // Index -1 means "nothing highlighted"; Array.at(-1) would return the
  // last option instead, so the bounds are checked explicitly.
  const activeOption =
    isOpen && activeIndex >= 0 && activeIndex < visibleOptions.length
      ? visibleOptions[activeIndex]
      : undefined;
  const getOptionId = (optionValue: string) =>
    `${baseId}-option-${optionValue}`;

  useEffect(() => {
    if (activeOption) {
      optionElements.current
        .get(activeOption.value)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [activeOption]);

  const open = (nextActiveIndex: number) => {
    setIsOpen(true);
    setActiveIndex(nextActiveIndex);
  };

  const close = () => {
    setIsOpen(false);
    setSearchQuery(null);
    setActiveIndex(NO_ACTIVE_INDEX);
  };

  const selectOption = (option: ComboboxOptionType) => {
    onChange(option.value);
    close();
  };

  const getSelectedIndex = () =>
    Math.max(
      visibleOptions.findIndex((option) => option.value === value),
      0,
    );

  const moveActiveIndex = (step: 1 | -1) => {
    if (!isOpen) {
      open(getSelectedIndex());
      return;
    }

    if (visibleOptions.length === 0) {
      return;
    }

    const lastIndex = visibleOptions.length - 1;
    const nextIndex = activeIndex + step;
    if (nextIndex > lastIndex) {
      setActiveIndex(0);
    } else if (nextIndex < 0) {
      setActiveIndex(lastIndex);
    } else {
      setActiveIndex(nextIndex);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case KEYS.down:
        event.preventDefault();
        moveActiveIndex(1);
        break;
      case KEYS.up:
        event.preventDefault();
        moveActiveIndex(-1);
        break;
      case KEYS.home:
      case KEYS.end:
        if (isOpen && visibleOptions.length > 0) {
          event.preventDefault();
          setActiveIndex(
            event.key === KEYS.home ? 0 : visibleOptions.length - 1,
          );
        }
        break;
      case KEYS.enter:
        // Enter inside an open list picks an option instead of submitting
        // the whole form.
        if (isOpen) {
          event.preventDefault();

          if (activeOption) {
            selectOption(activeOption);
          }
        }
        break;
      case KEYS.escape:
        if (isOpen) {
          // Keeps the modal around the form from closing on the same key.
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        break;
    }
  };

  return {
    listboxId,
    isOpen,
    visibleOptions,
    activeOptionValue: activeOption?.value,
    selectedValue: value,
    inputValue: searchQuery ?? selectedOption?.label ?? "",
    hasNoResults: isOpen && visibleOptions.length === 0,
    getOptionId,
    registerOptionElement: (
      optionValue: string,
      element: HTMLLIElement | null,
    ) => {
      if (element) {
        optionElements.current.set(optionValue, element);
      } else {
        optionElements.current.delete(optionValue);
      }
    },
    handleInputChange: (inputText: string) => {
      setSearchQuery(inputText);
      open(0);
    },
    handleInputClick: () => {
      if (!isOpen) {
        open(getSelectedIndex());
      }
    },
    handleToggleClick: () => (isOpen ? close() : open(getSelectedIndex())),
    handleKeyDown,
    handleBlur: () => {
      close();
      onBlur?.();
    },
    handleOptionHover: (optionIndex: number) => setActiveIndex(optionIndex),
    selectOption,
  };
};
