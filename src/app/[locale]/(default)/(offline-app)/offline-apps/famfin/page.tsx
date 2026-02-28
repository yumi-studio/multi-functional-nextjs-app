'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Grid,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUser,
  faWallet,
  faHistory,
  faHeart,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { OFFLINE_ACCOUNT_LOGIN_URL } from '@/app/lib/url_paths';
import { useAccountStore } from '@/app/lib/offline-apps/modules/account/account.store';
import { useFamFinStore } from '@/app/lib/offline-apps/modules/famfin/famfin.store';
import ProtectedRoute from '../../protected-route';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FamFinPage() {
  const { currentAccount, logout } = useAccountStore();
  const { wallets, transactions, wishItems, initDB, createWallet, addMoneyToWallet, withdrawMoneyFromWallet, createWishItem, addToWishItem, deleteWallet, deleteWishItem, getTransactionsByAccountId, getWishItemsByAccountId } = useFamFinStore();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Dialog states
  const [openWalletDialog, setOpenWalletDialog] = useState(false);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openWishDialog, setOpenWishDialog] = useState(false);

  // Form states
  const [walletName, setWalletName] = useState('');
  const [walletCurrency, setWalletCurrency] = useState('VND');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [wishName, setWishName] = useState('');
  const [wishTarget, setWishTarget] = useState('');
  const [wishCategory, setWishCategory] = useState('');
  const [wishPriority, setWishPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [wishDueDate, setWishDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing:', err);
        setIsInitialized(true);
      }
    };
    initialize();
  }, [initDB]);

  const handleLogout = async () => {
    await logout();
    router.push(OFFLINE_ACCOUNT_LOGIN_URL);
  };

  // Wallet handlers
  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      setError('Vui lòng nhập tên ví');
      return;
    }
    await createWallet(walletName, walletCurrency, currentAccount?.id || '');
    setSuccess('Tạo ví thành công!');
    setWalletName('');
    setWalletCurrency('VND');
    setOpenWalletDialog(false);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleAddTransaction = async () => {
    if (!selectedWallet || !amount) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      setError('Số tiền phải lớn hơn 0');
      return;
    }

    if (transactionType === 'income') {
      await addMoneyToWallet(selectedWallet, numAmount, description);
    } else {
      await withdrawMoneyFromWallet(selectedWallet, numAmount, description);
    }

    setSuccess(`${transactionType === 'income' ? 'Nạp' : 'Rút'} tiền thành công!`);
    setSelectedWallet('');
    setAmount('');
    setDescription('');
    setTransactionType('expense');
    setOpenTransactionDialog(false);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleCreateWish = async () => {
    if (!wishName.trim() || !wishTarget) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    await createWishItem(
      wishName,
      parseFloat(wishTarget),
      wishCategory,
      wishPriority,
      currentAccount?.id || '',
      wishDueDate
    );

    setSuccess('Tạo mục tiêu thành công!');
    setWishName('');
    setWishTarget('');
    setWishCategory('');
    setWishPriority('medium');
    setWishDueDate('');
    setOpenWishDialog(false);
    setTimeout(() => setSuccess(''), 2000);
  };

  if (!isInitialized) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  const userWallets = wallets.filter((w) => w.accountId === currentAccount?.id);
  const userTransactions = getTransactionsByAccountId(currentAccount?.id || '');
  const userWishItems = getWishItemsByAccountId(currentAccount?.id || '');
  const totalBalance = userWallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {currentAccount?.avatar ? (
                    <Avatar
                      src={currentAccount.avatar}
                      sx={{
                        width: 80,
                        height: 80,
                        boxShadow: 2,
                        border: '3px solid white',
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        fontSize: 40,
                        border: '3px solid white',
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </Avatar>
                  )}

                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {currentAccount?.username}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      💰 Quản lý Tài Chính Gia Đình
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box textAlign={'right'}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                  onClick={handleLogout}
                  startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                >
                  Đăng Xuất
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Total Balance */}
        <Card sx={{ mb: 3, boxShadow: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              Tổng Số Dư
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
              {totalBalance.toLocaleString('vi-VN')} đ
            </Typography>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card sx={{ boxShadow: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label={<><FontAwesomeIcon icon={faWallet} style={{ marginRight: 8 }} /> Ví Tiền</>} id="tab-0" />
            <Tab label={<><FontAwesomeIcon icon={faHistory} style={{ marginRight: 8 }} /> Lịch Sử Chi Tiêu</>} id="tab-1" />
            <Tab label={<><FontAwesomeIcon icon={faHeart} style={{ marginRight: 8 }} /> Mục Tiêu Tiết Kiệm</>} id="tab-2" />
          </Tabs>

          {/* Tab 1: Wallet Management */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Danh Sách Ví
                </Typography> */}
                <Grid container spacing={2} width={'100%'}>
                  <Grid size={4}>
                    <Button
                      variant="contained"
                      // startIcon={<FontAwesomeIcon icon={faPlus} />}
                      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      onClick={() => setOpenWalletDialog(true)}
                      fullWidth
                    >
                      Tạo Ví
                    </Button>
                  </Grid>
                  <Grid size={4}>
                    <Button
                      variant="contained"
                      // startIcon={<FontAwesomeIcon icon={faArrowUp} />}
                      sx={{ background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }}
                      onClick={() => {
                        setTransactionType('income');
                        setOpenTransactionDialog(true);
                      }}
                      fullWidth
                    >
                      Nạp
                    </Button>
                  </Grid>
                  <Grid size={4}>
                    <Button
                      variant="contained"
                      // startIcon={<FontAwesomeIcon icon={faArrowDown} />}
                      sx={{ background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' }}
                      onClick={() => {
                        setTransactionType('expense');
                        setOpenTransactionDialog(true);
                      }}
                      fullWidth
                    >
                      Rút
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {userWallets.length === 0 ? (
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Alert>Chưa có ví nào. Hãy tạo một ví mới!</Alert>
                  </Box>
                ) : (
                  userWallets.map((wallet) => (
                    <Card key={wallet.id} sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {wallet.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                              {wallet.currency}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (confirm('Xóa ví này?')) {
                                deleteWallet(wallet.id);
                                setSuccess('Xóa ví thành công!');
                              }
                            }}
                            sx={{ color: '#e74c3c' }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </IconButton>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2, color: '#27ae60' }}>
                          {wallet.balance.toLocaleString('vi-VN')} {wallet.currency}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 2: Transaction History */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Lịch Sử Chi Tiêu ({userTransactions.length})
              </Typography>

              {userTransactions.length === 0 ? (
                <Alert>Chưa có giao dịch nào</Alert>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ngày</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Mô Tả</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Số Tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type === 'income' ? 'Nạp' : 'Rút'}
                            color={transaction.type === 'income' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'right',
                            color: transaction.type === 'income' ? '#27ae60' : '#e74c3c',
                            fontWeight: 'bold',
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {transaction.amount.toLocaleString('vi-VN')} đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </TabPanel>

          {/* Tab 3: Wish List */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Danh Sách Mục Tiêu Tiết Kiệm
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FontAwesomeIcon icon={faPlus} />}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  onClick={() => setOpenWishDialog(true)}
                >
                  Tạo Mục Tiêu
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {userWishItems.length === 0 ? (
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Alert>Chưa có mục tiêu tiết kiệm nào</Alert>
                  </Box>
                ) : (
                  userWishItems.map((wishItem) => {
                    const percentage = (wishItem.currentAmount / wishItem.targetAmount) * 100;
                    return (
                      <Card key={wishItem.id} sx={{ boxShadow: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {wishItem.name}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                  label={wishItem.category}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={wishItem.priority}
                                  size="small"
                                  color={
                                    wishItem.priority === 'high'
                                      ? 'error'
                                      : wishItem.priority === 'medium'
                                        ? 'warning'
                                        : 'success'
                                  }
                                />
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (confirm('Xóa mục tiêu này?')) {
                                  deleteWishItem(wishItem.id);
                                  setSuccess('Xóa mục tiêu thành công!');
                                }
                              }}
                              sx={{ color: '#e74c3c' }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">
                                {wishItem.currentAmount.toLocaleString('vi-VN')} /{' '}
                                {wishItem.targetAmount.toLocaleString('vi-VN')} đ
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                                {percentage.toFixed(1)}%
                              </Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={percentage} sx={{ height: 8, borderRadius: 4 }} />
                          </Box>

                          {wishItem.dueDate && (
                            <Typography variant="caption" sx={{ color: '#999' }}>
                              Hạn: {wishItem.dueDate}
                            </Typography>
                          )}

                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => {
                              const addAmount = parseFloat(prompt('Nhập số tiền muốn thêm:') || '0');
                              if (addAmount > 0) {
                                addToWishItem(wishItem.id, addAmount);
                                setSuccess('Thêm vào mục tiêu thành công!');
                              }
                            }}
                          >
                            Thêm Tiền
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </Box>
            </Box>
          </TabPanel>
        </Card>

        {/* Dialogs */}
        {/* Create Wallet Dialog */}
        <Dialog open={openWalletDialog} onClose={() => setOpenWalletDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Tạo Ví Mới</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tên Ví"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              margin="dense"
              placeholder="VD: Ví Tiền Mặt"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Loại Tiền Tệ</InputLabel>
              <Select value={walletCurrency} onChange={(e) => setWalletCurrency(e.target.value)} label="Loại Tiền Tệ">
                <MenuItem value="VND">VND (Đồng Việt Nam)</MenuItem>
                <MenuItem value="USD">USD (Đô La Mỹ)</MenuItem>
                <MenuItem value="EUR">EUR (Euro)</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWalletDialog(false)}>Hủy</Button>
            <Button onClick={handleCreateWallet} variant="contained">
              Tạo
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Transaction Dialog */}
        <Dialog open={openTransactionDialog} onClose={() => setOpenTransactionDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{transactionType === 'income' ? 'Nạp Tiền' : 'Rút Tiền'}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Chọn Ví</InputLabel>
              <Select value={selectedWallet} onChange={(e) => setSelectedWallet(e.target.value)} label="Chọn Ví">
                {userWallets.map((wallet) => (
                  <MenuItem key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.currency})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Số Tiền"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="dense"
              placeholder="0"
            />
            <TextField
              fullWidth
              label="Mô Tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="dense"
              placeholder="VD: Lương tháng"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTransactionDialog(false)}>Hủy</Button>
            <Button onClick={handleAddTransaction} variant="contained">
              {transactionType === 'income' ? 'Nạp' : 'Rút'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Wish Dialog */}
        <Dialog open={openWishDialog} onClose={() => setOpenWishDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Tạo Mục Tiêu Tiết Kiệm</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tên Mục Tiêu"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              margin="dense"
              placeholder="VD: Du lịch Đà Nẵng"
            />
            <TextField
              fullWidth
              label="Số Tiền Mục Tiêu"
              type="number"
              value={wishTarget}
              onChange={(e) => setWishTarget(e.target.value)}
              margin="dense"
              placeholder="0"
            />
            <TextField
              fullWidth
              label="Danh Mục"
              value={wishCategory}
              onChange={(e) => setWishCategory(e.target.value)}
              margin="dense"
              placeholder="VD: Thoải Mái"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Độ Ưu Tiên</InputLabel>
              <Select value={wishPriority} onChange={(e) => setWishPriority(e.target.value as any)} label="Độ Ưu Tiên">
                <MenuItem value="low">Thấp</MenuItem>
                <MenuItem value="medium">Trung Bình</MenuItem>
                <MenuItem value="high">Cao</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ngày Hết Hạn (Tùy Chọn)"
              type="date"
              value={wishDueDate}
              onChange={(e) => setWishDueDate(e.target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWishDialog(false)}>Hủy</Button>
            <Button onClick={handleCreateWish} variant="contained">
              Tạo
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ProtectedRoute>
  );
}
