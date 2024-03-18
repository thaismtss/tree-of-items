import { describe, it, expect, vi, Mock, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Home from "./page";
import { convertToList } from "../utils";

vi.mock("../utils", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("../utils");
  return {
    ...actual,
    convertToList: vi.fn(),
  };
});

describe("Home Page", () => {
  beforeAll(() => {
    const mockData = [
      {
        id: 1,
        level: 0,
        name: "Item A",
        children: [
          {
            id: 2,
            level: 1,
            name: "Item B",
            children: [
              {
                id: 3,
                level: 2,
                name: "Item C",
                children: [],
              },
            ],
          },
          { id: 4, level: 1, name: "Item D", children: [] },
        ],
      },
    ];

    (convertToList as Mock).mockReturnValue(mockData);
  });

  it("renders page correctly", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /árvore de itens/i })
    ).toBeInTheDocument();
  });

  it("checked parent node should check all children", async () => {
    render(<Home />);
    const parentCheckbox = screen.getByRole("checkbox", {
      name: /Item A/i,
    });
    expect(parentCheckbox).toBeInTheDocument();
    expect(parentCheckbox).not.toBeChecked();

    await act(async () => {
      await userEvent.click(parentCheckbox);
    });

    expect(parentCheckbox).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item B/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item C/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item D/i })).toBeChecked();
  });

  it("unchecked parent node should uncheck all children", async () => {
    render(<Home />);
    const parentCheckbox = screen.getByRole("checkbox", {
      name: /Item A/i,
    });
    expect(parentCheckbox).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(parentCheckbox);
    });

    expect(parentCheckbox).toBeChecked();

    await act(async () => {
      await userEvent.click(parentCheckbox);
    });

    expect(parentCheckbox).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item B/i })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item C/i })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item D/i })).not.toBeChecked();
  });

  it("indeterminate parent node should check all children", async () => {
    render(<Home />);
    const parentCheckbox = screen.getByRole("checkbox", {
      name: /Item A/i,
    }) as HTMLInputElement;
    expect(parentCheckbox).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByRole("checkbox", { name: /Item B/i }));
    });

    expect(parentCheckbox.indeterminate).toBe(true);
    expect(screen.getByRole("checkbox", { name: /Item B/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item C/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Item D/i })).not.toBeChecked();
  });
});
