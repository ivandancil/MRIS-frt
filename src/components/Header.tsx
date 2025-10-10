import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header = ({title, subtitle}: HeaderProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  return (
    <Box>
        <Typography
            variant='h2'
            color={colors.grey[900]}
            fontWeight='bold'
            fontFamily="Poppins"
           
            sx={{
                 mb: "2px",
                fontSize: { xs: "1rem", sm: "1.50rem", md: "1.75rem" }, }}
        >
            {title}
        </Typography>
        <Typography
            variant='h5'
            color={colors.grey[900]}
            fontFamily="Poppins"
            sx={{  fontSize: { xs: ".6rem", sm: ".9rem", md: "1rem" } }}
        >
            {subtitle}
        </Typography>
    </Box>
  )
}

export default Header