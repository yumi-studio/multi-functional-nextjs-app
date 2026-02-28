'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { OFFLINE_ACCOUNT_CREATE_URL, OFFLINE_ACCOUNT_LOGIN_URL, OFFLINE_APP_URL } from '@/app/lib/url_paths';
import { useAccountStore } from '@/app/lib/offline-apps/modules/account/account.store';
import { LinkButton } from '@/app/ui/buttons';
import { useBackupStore } from '@/app/lib/offline-apps/modules/backup/backup.store';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { accounts, setCurrentAccount, initDB } = useAccountStore();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
      } catch (err) {
        console.error('Error initializing DB:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDB();
  }, [initDB]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!username.trim()) {
        setError('Vui lòng nhập tên đăng nhập');
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError('Vui lòng nhập mật khẩu');
        setLoading(false);
        return;
      }

      // Find account with matching username and password
      const account = accounts.find(
        (acc) => acc.username === username && acc.password === password
      );

      if (!account) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác');
        setLoading(false);
        return;
      }

      // Set current account and redirect
      await setCurrentAccount(account);
      
      setLoading(false);
      router.push(OFFLINE_APP_URL);
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      setLoading(false);
    }
  };

  const handleNavigateToCreate = () => {
    router.push(OFFLINE_ACCOUNT_CREATE_URL);
  };

  if (isInitializing) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  color: 'white',
                  fontSize: 30,
                }}
              >
                <FontAwesomeIcon icon={faSignInAlt} />
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
                Đăng Nhập
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                Truy cập tài khoản của bạn
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              {/* Username Field */}
              <TextField
                fullWidth
                label="Tên đăng nhập"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} style={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="Nhập mật khẩu"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} style={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />

              {/* Login Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: 8 }} />
                    Đăng Nhập
                  </>
                )}
              </Button>

              {/* Divider */}
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  hoặc
                </Typography>
              </Box>

              {/* Create Account Button */}
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleNavigateToCreate}
                disabled={loading}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 'bold',
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  },
                }}
              >
                Tạo Tài Khoản Mới
              </Button>
            </form>

            {/* Demo Info */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                <strong>💡 Gợi ý:</strong> Tạo một tài khoản mới hoặc sử dụng tài khoản ngoại tuyến đã tạo
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: '12px' }}>
              <LinkButton url={OFFLINE_APP_URL} variant='outlined'>Home | Offline Apps Center</LinkButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
