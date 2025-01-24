import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuList from "./MenuList";
import SubHeader from "./SubHeader";
import appShive from "../image/1.png";
import { useMediaQuery } from "@mui/material";
import "../ComponentCss/Header.css";
import "../ComponentCss/SubHeader.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[700], 0.15),
  width: "100%",
  maxWidth: "500px",
  border: "1px solid #cc5500",
  borderRadius: "6px",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  height: "40px",
  padding: "0 8px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#cc5500",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  fontSize: "0.9rem",
  lineHeight: "1.2",
  backgroundColor: "transparent",
  padding: "4px 0",
}));

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [placeholder, setPlaceholder] = React.useState("Search…");

  // Media query to check screen size
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

  const handleFocus = () => {
    setPlaceholder("");
  };

  const handleBlur = () => {
    setPlaceholder("Search…");
  };
  const handleProfileMenuOpen = (event) => {

    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/DynamicSearch?query=${event.target.value}`);
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    navigate("/logout");
  };

  return (
    <div>
      <AppBar
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "#cc5500",
        }}
        className="custom-app-bar"
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: isSmallScreen ? "5px 10px" : "10px 20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isSmallScreen ? "4px" : "16px",
            }}
          >
            <MenuList />
            <div className="custom-logo">
              <img
                src={appShive}
                alt="Logo"
                style={{
                  maxHeight: isSmallScreen ? "30px" : "40px",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
          </Box>

          
          {!isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={placeholder}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  sx={{
                    paddingLeft: "45px",
                    color: "#cc5500",
                    "& .MuiInputBase-input::placeholder": {
                      color: "#cc5500",
                      opacity: 1,
                      fontFamily: "GeneralSans-Medium",
                      wordSpacing: "2px",
                    },
                  }}
                />
              </Search>
              <SubHeader sx={{ display: "flex", marginLeft: "20px" }} />
            </Box>
          )}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{
              color: "#cc5500",
              marginLeft: isSmallScreen ? "auto" : "0",
            }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {isSmallScreen && (
        <Box
          sx={{
            padding: "10px 20px",
            marginTop: "40px",
            border: "1px solid #cc5500",
            marginLeft: "10px",
            marginRight: "10px",
            borderRadius: "6px",
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={placeholder}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              sx={{
                paddingLeft: "45px",
                color: "#cc5500",
                "& .MuiInputBase-input::placeholder": {
                  color: "#cc5500",
                  opacity: 1,
                  fontFamily: "GeneralSans-Medium",
                  wordSpacing: "2px",
                },
              }}
            />
          </Search>
          <SubHeader sx={{ display: "flex", marginTop: "10px" }} />
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Santhosh Reddy</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}