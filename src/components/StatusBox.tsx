import { Box, Typography } from "@mui/material"

interface StatusBoxProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
 
  }

  function StatusBox({ title, subtitle, icon }: StatusBoxProps) {

    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {icon && <Box mb={1}>{icon}</Box>}
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      
      </Box>
    )
  }

export default StatusBox