import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Link } from "../Link";

describe("Link Component", () => {
  const renderWithRouter = (
    ui: React.ReactElement,
    initialEntries: string[] = ["/"],
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("should render a link with the correct href", () => {
    renderWithRouter(<Link page={2}>Next</Link>);
    const linkElement = screen.getByRole("link", { name: /Next/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/?page=2");
  });

  it("should preserve existing query parameters", () => {
    renderWithRouter(<Link page={3}>3</Link>, ["/?sortBy=name&order=asc"]);
    const linkElement = screen.getByRole("link", { name: /3/i });

    const href = linkElement.getAttribute("href") || "";
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("page")).toBe("3");
    expect(url.searchParams.get("sortBy")).toBe("name");
    expect(url.searchParams.get("order")).toBe("asc");
  });

  it("should update the page parameter if it already exists", () => {
    renderWithRouter(<Link page={4}>4</Link>, ["/?page=1&sortBy=id"]);
    const linkElement = screen.getByRole("link", { name: /4/i });

    const href = linkElement.getAttribute("href") || "";
    const url = new URL(href, "http://localhost");
    expect(url.searchParams.get("page")).toBe("4");
    expect(url.searchParams.get("sortBy")).toBe("id");
  });
});
