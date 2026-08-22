import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';
import { data } from '../../mocks/data';

function renderFooter() {
  return render(<Footer />, { wrapper: MemoryRouter });
}

describe('Footer', () => {
  it('renders the two brand logo images', () => {
    renderFooter();
    const logos = screen.getAllByAltText('El Mono — Lonería Naval');
    expect(logos).toHaveLength(2);
    for (const logo of logos) {
      expect(logo.tagName).toBe('IMG');
    }
  });

  it('renders the main navigation links from nav.header', () => {
    renderFooter();
    for (const link of data.nav.header) {
      const rendered = screen.getByRole('link', { name: link.label });
      expect(rendered).toBeInTheDocument();
      expect(rendered.tagName).toBe('A');
      expect(rendered).toHaveAttribute('href', link.href);
    }
  });

  it('renders social and contact icon links with the expected hrefs', () => {
    renderFooter();
    for (const item of data.nav.footer.social) {
      expect(document.querySelector(`a[href="${item.href}"]`)).not.toBeNull();
    }
    for (const item of data.nav.footer.contact) {
      expect(document.querySelector(`a[href="${item.href}"]`)).not.toBeNull();
    }
  });

  it('opens external social links in a new tab with rel=noopener', () => {
    renderFooter();
    const facebook = document.querySelector(
      `a[href="${data.nav.footer.social[0].href}"]`,
    );
    expect(facebook).toHaveAttribute('target', '_blank');
    expect(facebook).toHaveAttribute('rel', 'noopener noreferrer');
  });

  describe('DevBadge signature', () => {
    it('renders the "Powered by: {name}" credit line', () => {
      renderFooter();
      expect(screen.getByText('Powered by: Lato')).toBeInTheDocument();
    });

    it('links to the dev LinkedIn profile from the badge', () => {
      renderFooter();
      // The badge is a single anchor with an aria-label derived from the name.
      const linkedinLink = screen.getByRole('link', {
        name: /Lato's Contact/i,
      });
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/lautaro-camejo-837339247/',
      );
    });

    it('does not render a WhatsApp link from the dev badge', () => {
      // The DevBadge carries only the LinkedIn signature now; the WhatsApp link
      // was removed from the footer signature. Asserting absence here keeps the
      // regression net tight if someone re-adds whatsappNumber later.
      renderFooter();
      const whatsappLinks = screen.queryAllByRole('link', {
        name: /Escribir a .* por WhatsApp/i,
      });
      expect(whatsappLinks).toHaveLength(0);
    });
  });
});
