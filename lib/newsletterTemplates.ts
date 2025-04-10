export interface NewsletterTemplate {
  id: string;
  name: string;
  exampleMessage: string;
  htmlWrapper: (content: string) => string;
}

export const newsletterTemplates: Record<string, NewsletterTemplate> = {
  classique: {
    id: 'classique',
    name: 'Classique',
    exampleMessage: 'Bonjour,\n\nVoici les dernières nouvelles de notre blog !\n\n[Votre contenu ici]\n\nÀ bientôt,\nL\'équipe',
    htmlWrapper: (content: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; }
          .container { padding: 20px; border: 1px solid #ccc; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Template Classique</h1>
          <div>${content.replace(/\n/g, '<br/>')}</div>
        </div>
      </body>
      </html>
    `,
  },
  festif: {
    id: 'festif',
    name: 'Festif',
    exampleMessage: '🎉 Bonjour à tous ! 🎉\n\nPréparez-vous pour des nouvelles excitantes !\n\n[Votre contenu ici]\n\nJoyeusement,\nL\'équipe',
    htmlWrapper: (content: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: cursive; background-color: #fff0f5; }
          .container { padding: 20px; border: 2px dashed #ff69b4; }
          h1 { color: #ff1493; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Template Festif</h1>
          <div>${content.replace(/\n/g, '<br/>')}</div>
        </div>
      </body>
      </html>
    `,
  },
  minimaliste: {
    id: 'minimaliste',
    name: 'Minimaliste',
    exampleMessage: 'Bonjour,\n\nL\'essentiel de nos actualités.\n\n[Votre contenu ici]\n\nCordialement,\nL\'équipe',
    htmlWrapper: (content: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: monospace; line-height: 1.6; }
          .container { padding: 15px; }
          h1 { font-size: 1.2em; font-weight: normal; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Template Minimaliste</h1>
          <div>${content.replace(/\n/g, '<br/>')}</div>
        </div>
      </body>
      </html>
    `,
  },
};