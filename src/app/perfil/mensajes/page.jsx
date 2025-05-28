'use client';
import { Suspense } from 'react';
import Mensajes from '@components/perfil/mensajes';

export default function MensajesPage() {
  return (
    <main className="container-fluid">
      <Suspense fallback={<div>Cargando mensajes...</div>}>
        <Mensajes />
      </Suspense>
    </main>
  );
}
