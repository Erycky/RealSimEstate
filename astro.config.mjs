import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // Se você estiver usando React
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Habilita a renderização no servidor para rodar o Supabase
  adapter: vercel(), // Indica que o destino final é a Vercel
  integrations: [react()], // Suas integrações atuais continuam aqui
});