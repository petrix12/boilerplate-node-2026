/* src/utils/template.util.js */
const fs = require('fs');
const path = require('path');

const renderEmailTemplate = (templateName, data) => {
    const filePath = path.join(__dirname, `../templates/emails/${templateName}.html`);
    let template = fs.readFileSync(filePath, 'utf-8');

    // Reemplaza todas las ocurrencias de {{variable}} por su valor
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value || '');
    }

    return template;
};

module.exports = { renderEmailTemplate };