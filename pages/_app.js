import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider, useDispatch } from 'react-redux';
import Layout from '../components/layout/Layout';
import { store } from '../store';
import { checkAuth, setUser } from '../store/authSlice';
import '../styles/globals.css';

// Auth checker component
function AuthChecker({ children }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Token varsa ve kullanıcı girişi yapılmışsa, kullanıcı bilgilerini al
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth())
        .unwrap()
        .then(() => {
          // Burada kullanıcı verilerini API'den almanız gerekebilir
          // Örneğin: getUserProfile() API çağrısı
          
          // Şimdilik yerel depodan kullanıcı bilgilerini alıyoruz (eğer kaydedilmişse)
          const userData = localStorage.getItem('userData');
          if (userData) {
            dispatch(setUser(JSON.parse(userData)));
          }
        })
        .catch(err => {
          console.error('Auth check failed:', err);
        });
    }
  }, [dispatch]);
  
  return children;
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  return (
    <Provider store={store}>
      <AuthChecker>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthChecker>
    </Provider>
  );
}

export default MyApp;
