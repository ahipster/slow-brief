import { Header } from './Header';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="container">
      <Header />
      <main>{children}</main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief.</p>
      </footer>
    </div>
  );
}
