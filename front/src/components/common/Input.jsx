// src/styles.js
import { styled } from '@mui/material/styles';
import {
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from '@mui/material';

// Styled Components with Modern Design
export const ModernBox = styled(Box)(({ theme }) => ({
  maxWidth: 1800,
  margin: '0 auto',
  background: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)',
  minHeight: '100vh',
}));

export const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    fontWeight: 500,
  },
}));

export const ModernButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 32px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #6C63FF 30%, #897CFF 90%)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(108, 99, 255, 0.4)',
  transition: 'all 0.3s ease',
  width: '230px',
  marginTop: theme.spacing(2),
  '&:hover': {
    background: 'linear-gradient(45deg, #5A54E6 30%, #7369E6 90%)',
    boxShadow: '0 6px 20px rgba(108, 99, 255, 0.6)',
    transform: 'translateY(-2px)',
  },
}));

export const ModernTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px',
  background: '#fff',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
}));

export const ModernTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(90deg, #6C63FF, #897CFF)',
  '& .MuiTableCell-head': {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: theme.spacing(2),
  },
}));

export const ModernTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    transform: 'scale(1.01)',
  },
}));

export const ModernTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#333',
  background: 'linear-gradient(45deg, #6C63FF, #897CFF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(4),
}));