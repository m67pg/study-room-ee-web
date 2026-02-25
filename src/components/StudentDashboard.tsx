import React from 'react';
import { Box, Typography, Button, Card, CardContent, Stack } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CoffeeIcon from '@mui/icons-material/Coffee';
import HomeIcon from '@mui/icons-material/Home';

interface StudentDashboardProps {
  user: any;
  status: number;
  totalSeconds: number;
  onAction: (status: number) => void;
  onLogout: () => void;
}

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const StatusBadge = ({ status }: { status: number }) => {
  const configs: any = {
    0: { label: '学外（退室中）', color: '#9e9e9e' },
    1: { label: '自習中（入室）', color: '#2e7d32' },
    2: { label: '休憩中（一時退出）', color: '#ed6c02' },
    3: { label: '自習中（戻り）', color: '#1976d2' },
  };
  const config = configs[status] || configs[0];
  return <Typography variant="h4" sx={{ color: config.color, fontWeight: 'bold' }}>{config.label}</Typography>;
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, status, totalSeconds, onAction, onLogout }) => (
  <Card sx={{ borderRadius: 4, boxShadow: 4, position: 'relative', width: '100%' }}>
    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
      <Button onClick={onLogout} color="inherit" size="small">
        <LogoutIcon fontSize="small" sx={{ mr: 0.5 }} /> ログアウト
      </Button>
    </Box>
    <CardContent sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
        こんにちは、{user?.username} さん（学籍番号: {user?.student_id}）
      </Typography>
      <Box sx={{ my: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>現在の状態</Typography>
        <StatusBadge status={status} />
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium', color: 'text.secondary' }}>
          今日の純自習時間: 
          <Box component="span" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold', fontSize: '1.4rem', fontFamily: 'monospace' }}>
            {formatDuration(totalSeconds)}
          </Box>
        </Typography>
      </Box>
      <Stack spacing={2}>
        {status === 0 && (
          <Button fullWidth variant="contained" color="success" size="large" startIcon={<LoginIcon />} onClick={() => onAction(1)} sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}>
            入室する
          </Button>
        )}
        {(status === 1 || status === 3) && (
          <>
            <Button fullWidth variant="contained" color="warning" size="large" startIcon={<CoffeeIcon />} onClick={() => onAction(2)} sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}>
              一時退出する
            </Button>
            <Button fullWidth variant="outlined" color="error" size="large" startIcon={<LogoutIcon />} onClick={() => onAction(0)} sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}>
              最終退室（帰宅）
            </Button>
          </>
        )}
        {status === 2 && (
          <Button fullWidth variant="contained" color="primary" size="large" startIcon={<HomeIcon />} onClick={() => onAction(3)} sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}>
            自習室に戻る
          </Button>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default StudentDashboard;