import React, { useState } from 'react';
import api from '../api/axios';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Avatar, 
  Alert,
  CssBaseline,
  createTheme,
  ThemeProvider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// 青色を基調としたシンプルなテーマ設定
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/login', { email, password });
      //alert(`ようこそ、${response.data.user.username}さん！`);
      window.location.reload(); // 状態更新のためにリロード（暫定）
    } catch (err: any) {
      setError(err.response?.data?.error || 'ログインに失敗しました');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* 画面全体の背景とレイアウトを制御 */}
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
        <CssBaseline />
        
        <Container maxWidth="xs">
          <Card 
            sx={{ 
              borderRadius: 4, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'visible' 
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56, boxShadow: 2 }}>
                  <LockOutlinedIcon fontSize="large" />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  自習室管理
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  サインインして利用を開始
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleLogin} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    fontWeight: 'bold',
                    textTransform: 'none', // 大文字固定を解除
                    fontSize: '1rem'
                  }}
                >
                  ログイン
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;