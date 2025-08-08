import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HeaderClient from './header-csr';
import { signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
   signOut: jest.fn(),
}));

jest.mock('next/link', () => {
   return function MockLink({
      children,
      href,
   }: {
      children: React.ReactNode;
      href: string;
   }) {
      return <a href={href}>{children}</a>;
   };
});

const mockSession = {
   user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://example.com/avatar.jpg',
      country: 'BR',
   },
   id: '1',
   country: 'BR',
   role: 'admin',
   expires: '2025-12-31T23:59:59.999Z',
} as const;

describe('HeaderClient Component', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('should render user name', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
   });

   it('should render navigation links', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Tours')).toBeInTheDocument();
      expect(screen.getByText('Configurações')).toBeInTheDocument();
   });
   it('should render admin link for admin users', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      const userButton = screen.getByLabelText('Menu do usuário: John Doe');
      fireEvent.click(userButton);

      expect(screen.getByText('Admin')).toBeInTheDocument();
   });

   it('should not render admin link for regular users', () => {
      const userSession = { ...mockSession, role: 'user' };
      render(<HeaderClient session={userSession as typeof mockSession} />);

      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
   });

   it('should toggle mobile menu when hamburger is clicked', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      const menuButton = screen.getByLabelText('Abrir menu');

      expect(screen.queryByText('Home')).toBeInTheDocument();

      act(() => {
         fireEvent.click(menuButton);
      });
   });

   it('should toggle user menu when user avatar is clicked', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      const userButton = screen.getByRole('button', { name: /john doe/i });

      act(() => {
         fireEvent.click(userButton);
      });

      expect(screen.getByText('Sair')).toBeInTheDocument();
   });

   it('should call signOut when logout is clicked', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      const userButton = screen.getByRole('button', { name: /john doe/i });
      act(() => {
         fireEvent.click(userButton);
      });

      const logoutButton = screen.getByText('Sair');
      act(() => {
         fireEvent.click(logoutButton);
      });

      expect(signOut).toHaveBeenCalledTimes(1);
   });

   it('should close menus when clicking outside', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      const userButton = screen.getByRole('button', { name: /john doe/i });
      act(() => {
         fireEvent.click(userButton);
      });

      expect(screen.getByText('Sair')).toBeInTheDocument();

      act(() => {
         fireEvent.mouseDown(document.body);
      });

      expect(screen.queryByText('Sair')).not.toBeInTheDocument();
   });

   it('should display user avatar when image is provided', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      const userButton = screen.getByRole('button', {
         name: /menu do usuário: john doe/i,
      });
      expect(userButton).toBeInTheDocument();
      expect(screen.getByText('J')).toBeInTheDocument();
   });

   it('should display default avatar when no image is provided', () => {
      const sessionWithoutImage = {
         ...mockSession,
         user: { ...mockSession.user, image: undefined },
      };

      render(
         <HeaderClient
            session={sessionWithoutImage as unknown as typeof mockSession}
         />,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
   });

   it('should highlight active page in navigation', () => {
      render(<HeaderClient session={mockSession as typeof mockSession} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Tours')).toBeInTheDocument();
      expect(screen.getByText('Configurações')).toBeInTheDocument();
   });
});
