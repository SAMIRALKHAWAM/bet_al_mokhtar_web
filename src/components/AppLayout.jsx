
import React, { useState } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <Outlet context={{ search }} />
    </div>
  );
};

export default AppLayout;
