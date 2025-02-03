'use client';

import { useEffect } from 'react';
import * as serviceWorker from '../serviceWorkerRegistration';

export default function PWARegistration() {
  useEffect(() => {
    serviceWorker.register();
  }, []);

  return null;
} 