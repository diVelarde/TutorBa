import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, currentPage }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
    </>
  );
}
