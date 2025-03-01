import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

export default function Notification() {

  return(
    <IconButton
      size="large"
      aria-label="show 3 new notifications"
      color="inherit"
    >
      <Badge badgeContent={3} color="error">
      <NotificationsIcon />
      </Badge>
    </IconButton>
  )
}