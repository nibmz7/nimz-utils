import { useContext } from 'react';

import { Router } from './BrowserRouter';
import { RouterContext } from './RouterContext';

const useNavigate = (): { go: Router['go']; replace: Router['replace'] } => {
  const { go, replace } = useContext(RouterContext);

  return { go, replace };
};

export default useNavigate;
