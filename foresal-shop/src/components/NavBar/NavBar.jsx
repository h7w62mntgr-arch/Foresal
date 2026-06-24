import { Link, NavLink } from 'react-router-dom';
import CartWidget from '../CartWidget/CartWidget';
import './NavBar.css';

const NavBar = () => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo">🌲</span>
        <span className="navbar__title">Foresal Shop</span>
      </Link>

      <nav className="navbar__nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          Inicio
        </NavLink>
        <NavLink to="/category/maderas" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          Maderas
        </NavLink>
        <NavLink to="/category/combustibles" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          Combustibles
        </NavLink>
        <NavLink to="/category/herramientas" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          Herramientas
        </NavLink>
        <NavLink to="/category/insumos" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          Insumos
        </NavLink>
      </nav>

      <CartWidget />
    </header>
  );
};

export default NavBar;
