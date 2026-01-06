# Testes da API LarAngola

## Estrutura

```
test/
├── e2e/                    # Testes End-to-End
│   └── controllers/        # Testes E2E dos controllers
├── unit/                   # Testes Unitários
│   ├── usecases/          # Testes dos use cases
│   ├── repositories/       # Testes dos repositories
│   ├── adapters/          # Testes dos adapters
│   └── entities/          # Testes das entities
├── setup/                  # Configurações e mocks
│   ├── mocks.ts           # Mocks do PrismaService
│   └── test-module.ts     # Helpers para criar módulos de teste
├── jest-e2e.json          # Configuração Jest para E2E
└── jest-unit.json         # Configuração Jest para Unitários
```

## Comandos

- `npm run test:unit` - Executa testes unitários
- `npm run test:e2e` - Executa testes E2E
- `npm run test` - Executa todos os testes
- `npm run test:cov` - Executa testes com cobertura

## Status

✅ Estrutura criada
✅ Configurações Jest criadas (e2e e unit)
✅ Mocks criados (PrismaService)
✅ Testes E2E: 14 controllers (todos criados)
✅ Testes Unitários:
  - 14 use cases
  - 14 repositories
  - 14 adapters
  - 14 entities
✅ Total: 72 arquivos de teste criados

## Nota

Os testes foram criados com estrutura básica. Alguns testes podem precisar de implementação completa dos casos de teste específicos de cada módulo. Os testes do módulo `User` estão completamente implementados como referência.

