import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link, Navigate } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();
  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };
  return (
    <div className="header">
      <Link to="/" className="link">
        <img
          className="header_logo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
      </Link>

      <div className="header_search">
        <input className="header_searchInput" type="text" />
        {/* logo */}
        <SearchIcon className="header_searchIcon" />
      </div>
      <div onClick={handleAuthentication} className="header_nav">
        <Link to={!user && "/login"} className="link">
          <div className="header_option">
            <span className="header_option_LineOne">
              Hello {user ? user.email : "Guest"}
            </span>
            <span className="header_option_LineTwo">
              {user ? "Sign Out" : "Sign In"}
            </span>
          </div>
        </Link>

        <div className="header_option">
          <span className="header_option_LineOne">Returns</span>
          <span className="header_option_LineTwo">& Orders</span>
        </div>

        <div className="header_option">
          <span className="header_option_LineOne">Your</span>
          <span className="header_option_LineTwo">Prime</span>
        </div>
        <Link to="/checkout">
          <div className="header_optionBasket">
            <ShoppingBasketIcon />
            <span className="header_optionLineTwo header_basketCount">
              {basket?.length}
              {/* this is ? optional chnaing which will prevent error for exceptoin numbers */}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
