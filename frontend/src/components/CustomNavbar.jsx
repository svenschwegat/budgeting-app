'use client'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@heroui/react";
import { useState, useEffect } from "react";

export const Logo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function CustomNavbar() {
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  return (
    <Navbar isBordered isBlurred={false} maxWidth="lg">
      <NavbarBrand>
        <Logo />
        <Link className="font-bold text-inherit" href="/dashboard">
          Meen Budget
        </Link>
      </NavbarBrand>
      <div className="flex-grow" />
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem isActive={activeItem === '/dashboard'} >
          <Link color="foreground" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeItem === '/dashboard/assets'} >
          <Link color="foreground" href="/dashboard/assets">
            📊 Assets
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeItem === '/input'} >
          <Link color="foreground" href="/input">
            Upload
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeItem === '/settings'} >
          <Link color="foreground" href="/settings">
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
