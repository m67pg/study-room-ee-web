import React, { useEffect, useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import api from './api/axios';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
  },
});

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  useEffect(() => {
    const initApp = async () => {
      try {
        const authRes = await api.get('/auth/check');
        if (authRes.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(authRes.data.user);
          const statusRes = await api.get('/attendance/current');
          setCurrentStatus(statusRes.data.status);
          setTotalSeconds(statusRes.data.totalSeconds || 0);
        }
      } catch (err) { console.log("Not logged in"); }
      finally { setLoading(false); }
    };
    initApp();
  }, []);

  useEffect(() => {
    let timer: any;
    if (isLoggedIn && (currentStatus === 1 || currentStatus === 3)) {
      timer = setInterval(() => setTotalSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isLoggedIn, currentStatus]);

  const handleLogout = async () => {
    try { await api.post('/logout'); }
    finally { window.location.href = '/'; }
  };

  const handleAction = async (nextStatus: number) => {
    setLoading(true); // 取得中にスピナーを表示

    // 位置情報を取得する Promise
    const getPosition = () => {
      return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, // 高精度（GPS優先）
          timeout: 10000,          // 10秒でタイムアウト
          maximumAge: 0            // キャッシュを利用しない
        });
      });
    };

    try {
      let lat: number | null = null;
      let lng: number | null = null;

      try {
        // 位置情報の取得を待機
        const pos = await getPosition();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (geoErr: any) {
        console.error("位置情報の取得に失敗:", geoErr);
        alert("位置情報が取得できませんでした。ブラウザの設定で許可してください。");
        setLoading(false);
        return; 
      }

      // バックエンドの API に status と座標を送信
      await api.post('/attendance/log', { 
        status: nextStatus,
        lat: lat,
        lng: lng
      });

      // 最新の状態を再取得
      const res = await api.get('/attendance/current');
      setCurrentStatus(res.data.status);
      setTotalSeconds(res.data.totalSeconds || 0);
    } catch (err) {
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // 垂直方向中央
          alignItems: 'center',    // 水平方向中央
          position: 'fixed',       // 親要素の制約を無視して画面全体を基準にする
          top: 0,
          left: 0,
        }}
      >

        {!isLoggedIn ? (
          <Login />
        ) : (
          <Container 
              maxWidth="xs" 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mx: 'auto', 
                width: '100%',
                px: 2
              }}
            >

            {(user?.student_id === "0" || user?.student_id === 0) ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <StudentDashboard 
                user={user} 
                status={currentStatus} 
                totalSeconds={totalSeconds} 
                onAction={handleAction} 
                onLogout={handleLogout} 
              />
            )}
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;