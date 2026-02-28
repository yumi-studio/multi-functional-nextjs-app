'use client';

import { useEffect } from 'react';
import { Container, Box, Card, CardContent, Typography, Avatar, Button, CardActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { OFFLINE_600LYTHUYETOTO_URL, OFFLINE_ACCOUNT_LOGIN_URL, OFFLINE_FAMFIN_URL } from '@/app/lib/url_paths';
import { Link } from '@/i18n/navigation';
import { useAccountStore } from '@/app/lib/offline-apps/modules/account/account.store';
import { NormalButton } from '@/app/ui/buttons';
import { resetDB } from '@/app/lib/offline-apps/database/indexdb';
import { useBackupStore } from '@/app/lib/offline-apps/modules/backup/backup.store';

export default function Page() {
  const { currentAccount, logout } = useAccountStore();
  const { currentBackup, setCurrentBackup } = useBackupStore();
  const router = useRouter();

  const URLS = [
    { path: OFFLINE_FAMFIN_URL, title: 'Quản lý Tài Chính Gia Đình' },
    { path: OFFLINE_600LYTHUYETOTO_URL, title: '600 câu hỏi lý thuyết ô tô' },
  ]

  const handleLogout = async () => {
    await logout();
    router.push(OFFLINE_ACCOUNT_LOGIN_URL);
  };

  const handleEnableBackup = async () => {

  };

  useEffect(() => {
    if (currentAccount) {

    }
  }, [currentAccount]);

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
      {URLS.map((url, key) => (
        <Card key={key} sx={{ boxShadow: 3, borderRadius: 2, my: '12px' }}>
          <Link href={url.path}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>{url.title}</Typography>
            </CardContent>
          </Link>
        </Card>
      ))}

      {currentAccount && (
        <Card sx={{ boxShadow: 3, borderRadius: 2, my: '12px' }}>
          <CardActions sx={{ alignItems: 'center', justifyContent: 'start' }}>

            <NormalButton variant='contained' color='primary' type='button' onClick={() => { }}>
              <span>Enable Backup</span>
            </NormalButton>          </CardActions>
        </Card>
      )}

      <Card sx={{ boxShadow: 3, borderRadius: 2, my: '12px' }}>
        <CardActions sx={{ alignItems: 'center', justifyContent: 'start' }}>
          <NormalButton variant='contained' color='error' type='button' onClick={() => resetDB()}>Reset Data</NormalButton>
        </CardActions>
      </Card>
    </Container>
  );
}
