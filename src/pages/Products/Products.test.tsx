import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Products } from "./Products";
import { data } from "../../mocks/data";

// Mock useFadeInOnView to avoid IntersectionObserver complexity
vi.mock("../../hooks/useFadeInOnView", () => ({
  useFadeInOnView: () => ({ ref: { current: null }, visible: true }),
}));

// Mock react-player so MediaPlayer doesn't load youtube-video-element
// (which throws unhandled rejections in jsdom).
vi.mock("react-player", () => ({
  default: (props: { src?: string }) => (
    <div data-testid="mock-player" data-src={props.src} />
  ),
}));

// Set VITE_WHATSAPP_URL for tests
beforeAll(() => {
  Object.defineProperty(import.meta, "env", {
    value: {
      VITE_WHATSAPP_URL: "https://wa.me/5491156137150?text=Hola",
    },
    writable: true,
  });
});

beforeEach(() => {
  window.sessionStorage.clear();
  // Products now reads/writes `?categoria=..&productoId=..` via replaceState.
  // Reset the URL so each test mounts on the default category (broches).
  window.history.replaceState(null, "", "/productos");
});

function renderProducts() {
  return render(
    <MemoryRouter initialEntries={["/productos"]}>
      <Products />
    </MemoryRouter>,
  );
}

// ActionBar renders Presupuestar/Borrar/counter, so queries must be scoped
// to avoid "found multiple elements" errors (e.g. Borrar lista button in
// the action bar vs. the same name in the confirmation modal).
// `hidden: true` because Radix sets aria-hidden on page content while a
// Dialog is open, and the bar is reachable for assertions anyway.
const getActionBar = () =>
  screen.getByRole("region", {
    name: /Acciones del presupuesto/i,
    hidden: true,
  });

describe("Products page", () => {
  it("renders the hero heading", () => {
    renderProducts();
    expect(
      screen.getByRole("heading", { level: 1, name: /Nuestros productos/i }),
    ).toBeInTheDocument();
  });

  it("renders one tab per product category", () => {
    renderProducts();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(data.products.categories.length);
  });

  it("renders the first category (Broches) as the active tab by default", () => {
    renderProducts();
    expect(
      screen.getByRole("tab", { name: /broches/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("img", { name: /broches/i })).toBeInTheDocument();
  });

  it("shows the category description in the info overlay", async () => {
    const user = userEvent.setup();
    renderProducts();

    await user.click(screen.getByLabelText(/ver información/i));
    expect(
      screen.getByText(/Broches de presión profesionales/i),
    ).toBeInTheDocument();
  });

  it("renders an image for the active category", () => {
    renderProducts();
    const images = screen.getAllByRole("img");
    // At least one image should be present (FaqBubble ImgCard)
    expect(images.length).toBeGreaterThan(0);
  });

  it("switching tab updates the active category, carousel, and overlay description", async () => {
    const user = userEvent.setup();
    renderProducts();

    // Default: Broches
    expect(
      screen.getByRole("tab", { name: /broches/i }),
    ).toHaveAttribute("aria-selected", "true");

    // Click Caballetes tab
    await user.click(screen.getByRole("tab", { name: /Caballetes/i }));

    // Tab switches and the carousel shows the new category products
    expect(
      screen.getByRole("tab", { name: /Caballetes/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Caballete Tubo Acero Inoxidable")).toBeInTheDocument();

    // Overlay description switches too
    await user.click(screen.getByLabelText(/ver información/i));
    expect(
      screen.getByText(/Caballetes de acero inoxidable/i),
    ).toBeInTheDocument();
  });

  it("shows the 'Video próximamente' placeholder when no video is linked", async () => {
    const user = userEvent.setup();
    renderProducts();

    // Default: Broches (no videoUrl) — placeholder instead of the player
    expect(screen.getByText("Video próximamente")).toBeInTheDocument();
    expect(screen.queryByTitle("Video")).not.toBeInTheDocument();

    // A category WITH a video (Caballetes) renders the player
    await user.click(screen.getByRole("tab", { name: /Caballetes/i }));
    expect(screen.queryByText("Video próximamente")).not.toBeInTheDocument();
    expect(screen.getByTitle("Video")).toBeInTheDocument();

    // A category WITHOUT video (Herrajes) keeps the placeholder
    await user.click(screen.getByRole("tab", { name: /Herrajes/i }));
    expect(screen.getByText("Video próximamente")).toBeInTheDocument();
    expect(screen.queryByTitle("Video")).not.toBeInTheDocument();
  });

  it("renders 1 carousel section (tabpanel) for the active category", () => {
    renderProducts();
    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(1);
  });

  it("disables prev/next when there is nothing to scroll", () => {
    renderProducts();
    // jsdom has no real overflow, so the carousel cannot scroll → both disabled.
    expect(screen.getByRole("button", { name: /anterior/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /siguiente/i })).toBeDisabled();
  });

  it("Presupuestar button is disabled when no products are selected", () => {
    renderProducts();
    const button = within(getActionBar()).getByRole("button", {
      name: /presupuestar/i,
    });
    expect(button).toBeDisabled();
  });

  it("selecting a product enables Presupuestar and shows counter", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    const desktopGroup = getActionBar();
    const button = within(desktopGroup).getByRole("button", {
      name: /presupuestar/i,
    });
    expect(button).not.toBeDisabled();
    expect(within(desktopGroup).getByText("1")).toBeInTheDocument();
  });

  it("opening modal lists selected product names", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Broche Lona Macho Bronce Blanco")).toBeInTheDocument();
  });

  it("× removes a product from the modal and updates selection", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    const dialog = screen.getByRole("dialog");
    // Modal should list both
    expect(within(dialog).getByText("Broche Lona Macho Bronce Blanco")).toBeInTheDocument();
    expect(within(dialog).getByText("Broche Lona Macho Bronce Gris")).toBeInTheDocument();

    // Remove first product
    const removeButtons = within(dialog).getAllByLabelText(/Quitar/);
    await user.click(removeButtons[0]);

    // First product should be gone from the modal
    expect(
      within(dialog).queryByText("Broche Lona Macho Bronce Blanco"),
    ).not.toBeInTheDocument();
    // Counter should show 1
    expect(within(getActionBar()).getByText("1")).toBeInTheDocument();
  });

  it("removing the last product from the quote modal closes it", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByLabelText(/quitar/i));

    // Quote modal auto-closes because the selection is now empty
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Presupuestar is disabled again (count = 0)
    expect(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    ).toBeDisabled();
  });

  it("does not reopen the quote modal when re-selecting after emptying the list", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    // Remove the only item inside the modal → modal auto-closes
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByLabelText(/quitar/i));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Select a new product: the modal must NOT reopen
    const checkboxesAfter = screen.getAllByRole("checkbox");
    await user.click(checkboxesAfter[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("WhatsApp URL contains selected products", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    const whatsappLink = screen.getByRole("link", {
      name: /consultar por whatsapp/i,
    });
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringContaining("Broche+Lona+Macho+Bronce+Blanco"),
    );
  });

  it("Escape closes the modal", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the 'Borrar lista' button (sky blue, disabled when no selection)", () => {
    renderProducts();
    const clearButton = within(getActionBar()).getByRole("button", {
      name: /borrar lista/i,
    });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton.className).toContain("bg-sc-sky-blue");
    expect(clearButton).toBeDisabled();
  });

  it("'Borrar lista' opens a confirmation modal without clearing the selection", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(within(getActionBar()).getByText("2")).toBeInTheDocument();

    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    );

    // Confirmation modal opens
    const dialogs = screen.getAllByRole("dialog");
    expect(dialogs.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/¿Estás seguro que querés borrar toda la lista/i),
    ).toBeInTheDocument();

    // Selection is still intact (counter still shows 2)
    expect(within(getActionBar()).getByText("2")).toBeInTheDocument();
  });

  it("Cancelar in confirmation modal closes it without clearing selection", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    );

    // Scope to the confirmation dialog
    const dialog = screen.getByRole("dialog", { name: /borrar lista/i });
    const cancelButton = within(dialog).getByRole("button", {
      name: /^cancelar$/i,
    });
    await user.click(cancelButton);

    // Modal closed, selection intact
    expect(
      screen.queryByText(/¿Estás seguro que querés borrar toda la lista/i),
    ).not.toBeInTheDocument();
    expect(within(getActionBar()).getByText("1")).toBeInTheDocument();
  });

  it("Borrar in confirmation modal clears all selections", async () => {
    const user = userEvent.setup();
    renderProducts();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    expect(within(getActionBar()).getByText("2")).toBeInTheDocument();

    await user.click(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    );

    // Scope to the confirmation dialog (the action bar Borrar lista button is outside)
    const dialog = screen.getByRole("dialog", { name: /borrar lista/i });
    const confirmButton = within(dialog).getByRole("button", {
      name: /borrar lista/i,
    });
    await user.click(confirmButton);

    // Selection cleared: counter badge is gone (hidden at 0), Presupuestar and Borrar lista are disabled
    expect(
      within(getActionBar()).queryByText("2"),
    ).not.toBeInTheDocument();
    expect(
      within(getActionBar()).getByRole("button", {
        name: /presupuestar/i,
      }),
    ).toBeDisabled();
    expect(
      within(getActionBar()).getByRole("button", {
        name: /borrar lista/i,
      }),
    ).toBeDisabled();
  });

  it("DOM order is ImgCard → MediaPlayer → ProductCarousel", () => {
    renderProducts();
    const tabpanel = screen.getByRole("tabpanel");
    const layoutContainer = tabpanel.closest('[data-testid="catalog-layout"]')!;
    expect(layoutContainer).not.toBeNull();
    const children = Array.from(layoutContainer.children);

    const imgCardChild = children.find(
      (c) =>
        c.querySelector("img") !== null &&
        !c.querySelector(".aspect-video"),
    );
    const rightChild = children.find((c) =>
      c.querySelector("[role='tabpanel']") !== null,
    );

    expect(imgCardChild).toBeDefined();
    expect(rightChild).toBeDefined();

    expect(children.indexOf(imgCardChild!)).toBeLessThan(
      children.indexOf(rightChild!),
    );

    const rightChildren = Array.from(rightChild!.children);
    const videoIndex = rightChildren.findIndex((c) =>
      c.querySelector(".aspect-video") !== null,
    );
    const carouselIndex = rightChildren.findIndex((c) =>
      c.querySelector("[role='tabpanel']") !== null,
    );

    expect(videoIndex).toBeGreaterThanOrEqual(0);
    expect(carouselIndex).toBeGreaterThan(videoIndex);
  });

  it("layout container has xl grid classes", () => {
    renderProducts();
    const tabpanel = screen.getByRole("tabpanel");
    const layoutContainer = tabpanel.closest('[data-testid="catalog-layout"]')!;
    expect(layoutContainer).not.toBeNull();
    const cn = layoutContainer.className;
    expect(cn).toContain("xl:grid");
    expect(cn).toContain("xl:grid-cols-12");
  });

  it("prev and next buttons scroll the carousel container", async () => {
    const user = userEvent.setup();
    renderProducts();

    const panel = screen.getByRole("tabpanel");
    const scrollContainer = panel.querySelector(
      ".overflow-x-auto",
    ) as HTMLElement;
    expect(scrollContainer).not.toBeNull();

    // Fake a scrollable overflow so the buttons become enabled.
    Object.defineProperty(scrollContainer, "clientWidth", {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(scrollContainer, "scrollWidth", {
      value: 300,
      configurable: true,
    });
    Object.defineProperty(scrollContainer, "scrollLeft", {
      value: 150,
      configurable: true,
    });
    scrollContainer.scrollBy = vi.fn();
    // Trigger recompute so canPrev/canNext reflect the faked layout.
    scrollContainer.dispatchEvent(new Event("scroll"));

    await user.click(screen.getByLabelText("Siguiente"));
    expect(scrollContainer.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );

    await user.click(screen.getByLabelText("Anterior"));
    expect(scrollContainer.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });

  it("mobile info toggle button works", async () => {
    const user = userEvent.setup();
    renderProducts();
    const toggleBtn = screen.getByLabelText(/ver información/i);
    expect(toggleBtn).toBeInTheDocument();
    await user.click(toggleBtn);
    expect(screen.getByLabelText(/cerrar información/i)).toBeInTheDocument();
  });

  it("toggles the overlay with the MONO TIP bubble", async () => {
    const user = userEvent.setup();
    renderProducts();
    expect(screen.queryByText(/MONO TIP/i)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText(/ver información/i));
    expect(screen.getByText(/MONO TIP/i)).toBeInTheDocument();
    await user.click(screen.getByLabelText(/cerrar información/i));
    expect(screen.queryByText(/MONO TIP/i)).not.toBeInTheDocument();
  });
});
