# Guia de Geração de Testes

## Status Atual

### ✅ Criados:

- Estrutura de pastas
- Configurações Jest (e2e e unit)
- Mocks do PrismaService
- Testes E2E: User, PropertyCategory, Property
- Testes Unitários: User (usecases, repository, adapter, entity)

### 🔄 Em Progresso:

- Testes E2E para os 11 controllers restantes
- Testes Unitários para os 13 módulos restantes

## Padrão de Testes

### E2E Controllers

- Setup com Test.createTestingModule
- Mock do PrismaService
- Testes de CRUD básico
- Validação de DTOs
- Tratamento de erros

### Unit Tests

- **Use Cases**: Mock do repository, testar lógica de negócio
- **Repositories**: Mock do PrismaService, testar conversões
- **Adapters**: Testar conversões entre camadas
- **Entities**: Testar criação, getters/setters, validações

## Próximos Passos

1. Completar testes E2E para todos os controllers
2. Completar testes unitários para todos os módulos
3. Adicionar testes de casos de borda
4. Configurar cobertura de código
