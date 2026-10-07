import { css } from "@emotion/css";
import { ChevronDown } from "lucide-react";
import { type Ref, useRef } from "react";

import { useCombobox } from "@/core/hooks/useCombobox";
import type { ComboboxOptionType } from "@/core/types";

import { useStyles } from "./Combobox.styles";

type ComboboxProps = {
  id: string;
  options: ComboboxOptionType[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
  placeholder?: string;
  hasError?: boolean;
  noResultsMessage?: string;
};

export const Combobox = ({
  id,
  options,
  value,
  onChange,
  onBlur,
  ref,
  placeholder,
  hasError = false,
  noResultsMessage = "Ничего не найдено",
}: ComboboxProps) => {
  const styles = useStyles(hasError);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const combobox = useCombobox({ options, value, onChange, onBlur });

  // The form library needs the input element too (it focuses the first
  // invalid field), so the local ref and the external one are both set.
  const setInputElement = (element: HTMLInputElement | null) => {
    inputElement.current = element;

    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  return (
    <div className={css(styles.root)}>
      <input
        ref={setInputElement}
        id={id}
        className={css(styles.input)}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={combobox.isOpen}
        aria-controls={combobox.listboxId}
        aria-activedescendant={
          combobox.activeOptionValue
            ? combobox.getOptionId(combobox.activeOptionValue)
            : undefined
        }
        aria-invalid={hasError}
        placeholder={placeholder}
        value={combobox.inputValue}
        onChange={(event) => combobox.handleInputChange(event.target.value)}
        // Selecting the shown label on focus lets typing replace it, so a
        // new search does not start with the previous choice in front.
        onFocus={(event) => event.currentTarget.select()}
        onClick={combobox.handleInputClick}
        onKeyDown={combobox.handleKeyDown}
        onBlur={combobox.handleBlur}
      />
      <button
        type="button"
        className={css(styles.toggle)}
        tabIndex={-1}
        aria-label="Показать варианты"
        onMouseDown={(event) => {
          // Keeps focus in the input, otherwise its blur would close the
          // list right before the toggle opens it again.
          event.preventDefault();
          inputElement.current?.focus();
          combobox.handleToggleClick();
        }}
      >
        <ChevronDown className={css(styles.toggleIcon)} aria-hidden="true" />
      </button>
      {combobox.isOpen ? (
        <div className={css(styles.popup)}>
          <ul
            id={combobox.listboxId}
            role="listbox"
            className={css(styles.list)}
            hidden={combobox.hasNoResults}
          >
            {combobox.visibleOptions.map((option, optionIndex) => (
              <li
                key={option.value}
                ref={(element) =>
                  combobox.registerOptionElement(option.value, element)
                }
                id={combobox.getOptionId(option.value)}
                role="option"
                aria-selected={option.value === combobox.selectedValue}
                className={css(
                  styles.option,
                  option.value === combobox.activeOptionValue &&
                    styles.activeOption,
                  option.value === combobox.selectedValue &&
                    styles.selectedOption,
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => combobox.handleOptionHover(optionIndex)}
                onClick={() => combobox.selectOption(option)}
              >
                {option.label}
                {option.description ? (
                  <span className={css(styles.optionDescription)}>
                    {option.description}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          {combobox.hasNoResults ? (
            <div className={css(styles.noResults)} aria-hidden="true">
              {noResultsMessage}
            </div>
          ) : null}
        </div>
      ) : null}
      {/* The live region exists before its text appears; a region inserted
          together with the message is often not announced. */}
      <div className={css(styles.visuallyHidden)} role="status">
        {combobox.hasNoResults ? noResultsMessage : ""}
      </div>
    </div>
  );
};
