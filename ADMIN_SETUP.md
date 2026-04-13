# Setup do Admin LarAngola

## Criar Usuário Admin

Execute no banco de dados PostgreSQL:

```sql
-- Criar usuário admin
INSERT INTO "User" (id, email, phone, password, name, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@larangola.com',
  '900000000',
  '$2b$10$YourHashedPasswordHere', -- Precisa gerar hash bcrypt
  'Administrador',
  true,
  NOW(),
  NOW()
);

-- Atualizar role para ADMIN (adicionar coluna se não existir)
-- Ou usar JWT com claim de role
```

## Gerar hash de senha

Use o endpoint de registro para criar um usuário normal, depois atualize manualmente no banco:

```bash
# 1. Crie um usuário via API ou mobile
# 2. Atualize no banco para ser admin (se tiver coluna role)
# Ou use o login existente e verifique o token JWT
```

## Endpoints Admin Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/admin/dashboard/stats` | GET | Estatísticas do dashboard |
| `/api/v1/admin/properties/pending` | GET | Listar imóveis pendentes |
| `/api/v1/admin/properties/:id/approve` | POST | Aprovar imóvel |
| `/api/v1/admin/properties/:id/reject` | POST | Rejeitar imóvel |
| `/api/v1/admin/agents` | POST | Criar agente |
| `/api/v1/admin/agents/:id/verify` | POST | Verificar agente |

## Autenticação

Todos os endpoints admin requerem:
```
Authorization: Bearer <token>
```

O token JWT deve conter `role: "ADMIN"`.

## Próximo Passo

Para criar o primeiro admin, você pode:

1. **Opção 1**: Criar via SQL direto no banco
2. **Opção 2**: Adicionar uma variável de ambiente `ADMIN_EMAIL` e verificar no login
3. **Opção 3**: Criar um endpoint temporário de setup

Recomendamos a **Opção 2** para produção.
