import { createFileRoute } from '@tanstack/react-router';
import { Keystatic } from '@keystatic/core/ui';
import config from '../../../keystatic.config';

export const Route = createFileRoute('/keystatic/$')({
  component: KeystaticPage,
});

function KeystaticPage() {
  return <Keystatic config={config} />;
}
