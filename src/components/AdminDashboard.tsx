import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Stack, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import api from '../api/axios';

const AdminDashboard: React.FC<any> = ({ user, onLogout }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

  useEffect(() => {
    // 生徒一覧を取得
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) {
        console.error("生徒リスト取得失敗", err);
      }
    };
    fetchStudents();
  }, []);

  const handleExportExcel = () => {
    // 選択された生徒IDをクエリパラメータとして渡す
    window.location.href = `${api.defaults.baseURL}/attendance/export?student_user_id=${selectedStudentId}`;
  };

  return (
    <Card sx={{ 
      borderRadius: 4, 
      boxShadow: 4, 
      position: 'relative', 
      width: '100%',   
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <Button onClick={onLogout} color="inherit" size="small">
          <LogoutIcon fontSize="small" sx={{ mr: 0.5 }} /> ログアウト
        </Button>
      </Box>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
          こんにちは、{user?.username} さん
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          管理者モード
        </Typography>

        <Stack spacing={3}>
          <FormControl fullWidth size="small">
            <InputLabel>出力対象の生徒を選択</InputLabel>
            <Select
              value={selectedStudentId}
              label="出力対象の生徒を選択"
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <MenuItem value="all">全員（全生徒の合計）</MenuItem>
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.username} (学籍番号: {s.student_id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            fullWidth variant="contained" color="primary" size="large"
            startIcon={<FileDownloadIcon />} onClick={handleExportExcel}
            sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}
          >
            {selectedStudentId === 'all' ? '全履歴をExcel出力' : '選択した生徒の履歴を出力'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;