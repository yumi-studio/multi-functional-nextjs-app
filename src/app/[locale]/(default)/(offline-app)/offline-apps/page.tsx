'use client';

import { Container, Box, Card, CardContent, Typography, Avatar, Button, CardActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { OFFLINE_ACCOUNT_LOGIN_URL, OFFLINE_FAMFIN_URL } from '@/app/lib/url_paths';
import { Link } from '@/i18n/navigation';
import { useAccountStore } from '@/app/lib/offline-apps/modules/account/account.store';
import { NormalButton } from '@/app/ui/buttons';
import { resetDB } from '@/app/lib/offline-apps/database/indexdb';

export default function Page() {
  const { currentAccount, logout } = useAccountStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(OFFLINE_ACCOUNT_LOGIN_URL);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {currentAccount && (
        <Box sx={{ mb: 4 }}>
          {/* Header Card */}
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {currentAccount?.avatar ? (
                    <Avatar
                      src={currentAccount.avatar}
                      sx={{
                        width: 100,
                        height: 100,
                        boxShadow: 2,
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: '#667eea',
                        fontSize: 40,
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </Avatar>
                  )}

                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {currentAccount?.username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                      Tài khoản ngoại tuyến
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bbb' }}>
                      Được tạo: {currentAccount?.createdAt ? new Date(currentAccount.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                  sx={{
                    fontWeight: 'bold',
                    width: '100%',
                    mt: '24px'
                  }}
                >
                  Đăng Xuất
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Main Content */}
      <Link href={OFFLINE_FAMFIN_URL}>
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>Quản lý Tài Chính Gia Đình</Typography>
            <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8 }}>
              Tính năng này sẽ được phát triển...
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 3, borderRadius: 2, my: '12px' }}>
          <CardActions sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <NormalButton variant='contained' color='error' type='button' onClick={() => resetDB()}>Reset Data</NormalButton>
          </CardActions>
        </Card>
      </Link>
    </Container>
  );
}
