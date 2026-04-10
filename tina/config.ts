import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'chapters_es',
        label: 'Capítulos (Español)',
        path: 'src/content/es',
        format: 'mdx',
        fields: [
          {
            name: 'title',
            label: 'Título',
            type: 'string',
            required: true,
          },
          {
            name: 'chapter',
            label: 'Número de capítulo',
            type: 'number',
          },
          {
            name: 'order',
            label: 'Orden en navegación',
            type: 'number',
            required: true,
          },
          {
            name: 'body',
            label: 'Contenido',
            type: 'rich-text',
            isBody: true,
            templates: [
              {
                name: 'Exercise',
                label: 'Ejercicio',
                fields: [
                  {
                    name: 'id',
                    label: 'ID único',
                    type: 'string',
                    required: true,
                  },
                  {
                    name: 'title',
                    label: 'Título',
                    type: 'string',
                    required: true,
                  },
                  {
                    name: 'type',
                    label: 'Tipo',
                    type: 'string',
                    required: true,
                    options: [
                      { label: 'Texto abierto', value: 'open-text' },
                      { label: 'Lista guiada', value: 'guided-list' },
                      { label: 'Autoevaluación', value: 'self-assessment' },
                      { label: 'Comparación', value: 'comparison' },
                    ],
                  },
                  {
                    name: 'instructions',
                    label: 'Instrucciones',
                    type: 'string',
                    ui: { component: 'textarea' },
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
