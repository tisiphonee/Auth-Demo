import { ClientGate } from '@/components/auth/ClientGate';
import { DashboardClient } from '@/components/auth/DashboardClient';

export default function DashboardPage() {
  return (
    <ClientGate>
      <DashboardClient />
    </ClientGate>
  );
}
