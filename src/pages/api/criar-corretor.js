import { createClient } from '@supabase/supabase-js';

export const POST = async ({ request }) => {
  try {
    const { email, password, nome } = await request.json();

    // Inicializa o cliente com a Service Role (Chave Mestra) para ter super poderes no servidor
    const supabaseAdmin = createClient(
      import.meta.env.SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY // Adicione essa variável no seu arquivo .env
    );

    // 1. Cria o usuário diretamente no Auth do Supabase (sem deslogar quem está chamando)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Já cria com o e-mail confirmado para facilitar
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
    }

    const novoUsuarioId = authData.user.id;

    // 2. Insere o registro correspondente na sua tabela 'perfis' com a role de 'corretor'
    const { error: perfilError } = await supabaseAdmin
      .from('perfis')
      .insert([
        {
          id: novoUsuarioId,
          nome: nome,
          role: 'corretor' // Forçando a role para corretor por segurança
        }
      ]);

    if (perfilError) {
      // Caso dê erro no perfil, remove o usuário do auth para não gerar lixo
      await supabaseAdmin.auth.admin.deleteUser(novoUsuarioId);
      return new Response(JSON.stringify({ error: perfilError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Corretor cadastrado com sucesso!' }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro interno no servidor.' }), { status: 500 });
  }
};