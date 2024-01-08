import React, {Fragment} from "react";
import { Link } from "react-router-dom";
import {useUser} from "../../store/UserStore";
import {observer} from "mobx-react-lite";

const NavBar = observer(() => {

    const {token, logout} = useUser();

  return (
    <nav className="h-14 sticky mb-4 top-0 right-0 left-0 bg-blue-400 flex items-center justify-between py-1.5 px-4">
      <Link to='/' className="text-xl text-white font-bold">Appointer App</Link>
      <div className="flex gap-6">
        <Link to="/" className="nav-link">List</Link>
        <Link to="/appointment/add" className="nav-link">Add</Link>
          <p>|</p>
          {token ? <button onClick={logout} className="btn-out">Log out</button> : <Fragment>
              <Link to="/profile/register" className="btn-auth">Register</Link>
              <Link to="/profile/log-in" className="btn-auth">Log in</Link>
          </Fragment>}

      </div>
    </nav>
  );
});

export default NavBar;
