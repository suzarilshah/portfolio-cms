import SettingsForm from './SettingsForm';

export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--text)] mb-6">Site Settings</h2>
      <SettingsForm />
    </div>
  );
}
