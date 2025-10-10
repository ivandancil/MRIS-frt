import { Box } from "@mui/material"
import Header from "../../components/Header"


const ExtractID = () => {
  return (
     <Box m="20px">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header
              title="Extract ID"
              subtitle="Extract ID using OCR and upload securely"
            />
        </Box>
    </Box>
  )
}

export default ExtractID