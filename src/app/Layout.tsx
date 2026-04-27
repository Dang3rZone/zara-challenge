import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// import { Navbar } from '@/shared/components/Navbar/Navbar';
import styles from './Layout.module.scss';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      {/* <Navbar /> */}
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </>
  );
}
