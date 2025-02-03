import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { UserCircle2, AlertCircle, X, CheckCircle2 } from 'lucide-react';

// Define the props interface
interface ValidationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

const ValidationPopup: React.FC<ValidationPopupProps> = ({ isOpen, onClose, onAction }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="validation-dialog-title"
      aria-describedby="validation-dialog-description"
      PaperProps={{
        sx: { borderRadius: 2, p: 2 },
      }}
    >
      <DialogTitle
        id="validation-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <UserCircle2 size={24} color="#6B21A8" />
        <Typography variant="h6" component="div">
          Complete Your Profile
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ marginLeft: 'auto', color: 'grey.500' }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
      >
        <AlertCircle size={20} color="#D97706" />
        <Typography
          id="validation-dialog-description"
          variant="body2"
          color="textSecondary"
        >
          Please complete your profile details before proceeding. This
          information is required for order processing and delivery.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          startIcon={<X size={16} />}
          sx={{
            color: 'grey.700',
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onAction}
          startIcon={<CheckCircle2 size={16} />}
          sx={{
            color: 'white',
            bgcolor: '#6B21A8',
            '&:hover': { bgcolor: '#5B199A' },
          }}
        >
          Update Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationPopup;
