'use client';

import { useState, useRef, useEffect } from 'react';
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
  Avatar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faImage, faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { OFFLINE_ACCOUNT_LOGIN_URL } from '@/app/lib/url_paths';
import { useOfflineAccountStore } from '../store';

export default function CreateAccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { accounts, addAccount, initDB } = useOfflineAccountStore();

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

  // Handle Avatar Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước hình ảnh không được vượt quá 5MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setAvatar(base64String);
      setAvatarPreview(base64String);
      setError('');
    };
    reader.onerror = () => {
      setError('Lỗi khi đọc tệp');
    };
    reader.readAsDataURL(file);
  };

  // Remove Avatar
  const handleRemoveAvatar = () => {
    setAvatar('');
    setAvatarPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Form Submission
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!username.trim()) {
        setError('Vui lòng nhập tên đăng nhập');
        setLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Tên đăng nhập phải có ít nhất 3 ký tự');
        setLoading(false);
        return;
      }

      if (username.length > 20) {
        setError('Tên đăng nhập không được vượt quá 20 ký tự');
        setLoading(false);
        return;
      }

      // Check if username already exists
      if (accounts.some((acc) => acc.username === username)) {
        setError('Tên đăng nhập này đã được sử dụng');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Vui lòng nhập mật khẩu');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        setLoading(false);
        return;
      }

      // Create new account
      const newAccount = {
        id: Date.now().toString(),
        username,
        password,
        avatar: avatar || null,
        createdAt: new Date().toISOString(),
      };

      await addAccount(newAccount);
      
      setSuccess('Tài khoản đã được tạo thành công!');
      
      // Reset form
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setAvatar('');
      setAvatarPreview('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(OFFLINE_ACCOUNT_LOGIN_URL);
      }, 2000);
      
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo tài khoản');
    } finally {
      setLoading(false);
    }
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
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                <FontAwesomeIcon icon={faUser} />
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
                Tạo Tài Khoản
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                Đăng ký tài khoản ngoại tuyến mới của bạn
              </Typography>
            </Box>

            {/* Success Alert */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }} icon={<FontAwesomeIcon icon={faCheckCircle} />}>
                {success}
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Create Account Form */}
            <form onSubmit={handleCreateAccount} style={{ width: '100%' }}>
              {/* Avatar Upload Section */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  <FontAwesomeIcon icon={faImage} style={{ marginRight: 8 }} />
                  Ảnh Đại Diện
                </Typography>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />

                {avatarPreview ? (
                  <Box sx={{ mb: 2 }}>
                    <Avatar
                      src={avatarPreview}
                      sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto',
                        mb: 2,
                        boxShadow: 2,
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                      >
                        Thay Đổi
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleRemoveAvatar}
                        disabled={loading}
                      >
                        Xóa
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: '2px dashed #f5576c',
                      borderRadius: 2,
                      p: 3,
                      cursor: 'pointer',
                      backgroundColor: 'rgba(245, 87, 108, 0.05)',
                      transition: 'all 0.3s ease',
                      mb: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(245, 87, 108, 0.1)',
                        borderColor: '#f5576c',
                      },
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        margin: '0 auto',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <FontAwesomeIcon icon={faImage} style={{ fontSize: 40, color: '#f5576c' }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Nhấp để chọn ảnh
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      (JPG, PNG, GIF - Tối đa 5MB)
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Username Field */}
              <TextField
                fullWidth
                label="Tên đăng nhập"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="3-20 ký tự"
                disabled={loading}
                helperText={`${username.length}/20`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} style={{ color: '#f5576c' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#f5576c',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f5576c',
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
                placeholder="Ít nhất 6 ký tự"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ color: '#f5576c' }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#f5576c',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f5576c',
                    },
                  },
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Xác Nhận Mật Khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="Nhập lại mật khẩu"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ color: '#f5576c' }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#f5576c',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f5576c',
                    },
                  },
                }}
              />

              {/* Create Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }} />
                    Tạo Tài Khoản
                  </>
                )}
              </Button>

              {/* Back to Login Button */}
              <Button
                fullWidth
                variant="text"
                onClick={() => router.push(OFFLINE_ACCOUNT_LOGIN_URL)}
                disabled={loading}
                sx={{
                  color: '#f5576c',
                  '&:hover': {
                    backgroundColor: 'rgba(245, 87, 108, 0.04)',
                  },
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
                Quay Lại Đăng Nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
