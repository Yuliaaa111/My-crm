import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import type { ComboboxOptionType } from "@/core/types";
import { Combobox } from "@/core/ui/Combobox/Combobox";

const OPTIONS: ComboboxOptionType[] = [
  {
    value: "customer-1",
    label: "Иван Петров",
    description: "СеверСтрой",
    searchValues: ["Иван", "Петров", "СеверСтрой"],
  },
  {
    value: "customer-2",
    label: "Мария Смирнова",
    description: "Лента Медиа",
    searchValues: ["Мария", "Смирнова", "Лента Медиа"],
  },
  {
    value: "customer-12",
    label: "Юлия Захарова",
    description: "СибАгро",
    searchValues: ["Юлия", "Захарова", "СибАгро"],
  },
];

const renderCombobox = (initialValue = "", onSubmit = vi.fn()) => {
  const onChange = vi.fn();

  const Controlled = () => {
    const [value, setValue] = useState(initialValue);

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="customer">Клиент</label>
        <Combobox
          id="customer"
          options={OPTIONS}
          value={value}
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          placeholder="Имя или компания"
        />
      </form>
    );
  };

  render(<Controlled />);

  return {
    user: userEvent.setup(),
    input: screen.getByRole("combobox", { name: "Клиент" }),
    onChange,
    onSubmit,
  };
};

const visibleOptions = () =>
  screen
    .queryAllByRole("option")
    .map((option) => option.firstChild?.textContent);

describe("Combobox", () => {
  it("закрыт по умолчанию и связан со списком через ARIA", async () => {
    const { user, input } = renderCombobox();

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-autocomplete", "list");

    await user.click(input);

    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "id",
      input.getAttribute("aria-controls"),
    );
    expect(visibleOptions()).toEqual([
      "Иван Петров",
      "Мария Смирнова",
      "Юлия Захарова",
    ]);
  });

  it("фильтрует без учёта регистра по всем searchValues", async () => {
    const { user, input } = renderCombobox();

    await user.type(input, "сИбАгРо");
    expect(visibleOptions()).toEqual(["Юлия Захарова"]);

    await user.clear(input);
    await user.type(input, "СМИРН");
    expect(visibleOptions()).toEqual(["Мария Смирнова"]);
  });

  it("показывает «Ничего не найдено» и сообщает об этом в live-области", async () => {
    const { user, input } = renderCombobox();

    await user.type(input, "zzz");

    expect(visibleOptions()).toEqual([]);
    expect(screen.getByRole("status")).toHaveTextContent("Ничего не найдено");
    expect(screen.getByRole("listbox", { hidden: true })).not.toBeVisible();
  });

  it("стрелки двигают выделение по кругу, Enter выбирает и не отправляет форму", async () => {
    const { user, input, onChange, onSubmit } = renderCombobox();

    await user.click(input);
    await user.keyboard("{ArrowDown}");
    const activeId = input.getAttribute("aria-activedescendant");
    expect(activeId).toBe(screen.getAllByRole("option")[1].id);

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0].id,
    );

    await user.keyboard("{ArrowUp}{Enter}");

    expect(onChange).toHaveBeenCalledWith("customer-12");
    expect(input).toHaveValue("Юлия Захарова");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("Home и End переходят к первому и последнему варианту", async () => {
    const { user, input } = renderCombobox();

    await user.click(input);
    await user.keyboard("{End}");
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[2].id,
    );

    await user.keyboard("{Home}");
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0].id,
    );
  });

  it("Escape закрывает список и возвращает выбранное значение", async () => {
    const { user, input, onChange } = renderCombobox("customer-1");
    expect(input).toHaveValue("Иван Петров");

    await user.clear(input);
    await user.type(input, "Мария");
    await user.keyboard("{Escape}");

    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveValue("Иван Петров");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("уход из поля без выбора тоже возвращает выбранное значение", async () => {
    const { user, input } = renderCombobox("customer-1");

    await user.clear(input);
    await user.type(input, "Мария");
    await user.tab();

    expect(input).toHaveValue("Иван Петров");
  });

  it("выбор мышью и отметка выбранного варианта aria-selected", async () => {
    const { user, input, onChange } = renderCombobox();

    await user.click(input);
    await user.click(screen.getByRole("option", { name: /Мария Смирнова/ }));

    expect(onChange).toHaveBeenCalledWith("customer-2");
    expect(input).toHaveValue("Мария Смирнова");

    await user.click(screen.getByRole("button", { name: "Показать варианты" }));
    expect(
      screen.getByRole("option", { name: /Мария Смирнова/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("при фокусе выделяет текст, чтобы ввод заменял его", async () => {
    const { user, input } = renderCombobox("customer-1");

    await user.click(input);
    await user.keyboard("Захар");

    expect(visibleOptions()).toEqual(["Юлия Захарова"]);
  });
});
