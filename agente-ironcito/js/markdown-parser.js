// parser ligero y seguro de markdown y tarjetas de veredicto para ironcito

const VERDICT_DEFINITIONS = [
  {
    type: 'recommended',
    icon: '✅',
    badge: 'Opción Recomendada',
    regex: /^(?:[-*•]\s+)?(\*\*)?\s*✅\s*(.*)$/u,
  },
  {
    type: 'alternative',
    icon: '⚠️',
    badge: 'Opción Alternativa',
    regex: /^(?:[-*•]\s+)?(\*\*)?\s*⚠\uFE0F?\s*(.*)$/u,
  },
  {
    type: 'incompatible',
    icon: '❌',
    badge: 'Incompatibilidad',
    regex: /^(?:[-*•]\s+)?(\*\*)?\s*❌\s*(.*)$/u,
  },
];

// escapa caracteres html para evitar inyeccion de codigo
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// aplica formato markdown inline seguro sobre texto escapado
function formatInline(rawText) {
  let html = escapeHtml(rawText);

  // protege fragmentos de codigo inline antes de aplicar negritas o cursivas
  const codePlaceholders = [];
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const idx = codePlaceholders.length;
    codePlaceholders.push(`<code>${code}</code>`);
    return `\u0000CODE_${idx}\u0000`;
  });

  // enlaces markdown con protocolo http o https
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // negrita con cursiva
  html = html.replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>');

  // negrita
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_\n]+?)__/g, '<strong>$1</strong>');

  // cursiva evitando asteriscos aislados
  html = html.replace(/(^|[\s(>])\*([^*\n]+?)\*(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>');

  // restaura los fragmentos de codigo inline
  html = html.replace(/\u0000CODE_(\d+)\u0000/g, (_, idx) => codePlaceholders[Number(idx)]);

  return html;
}

// detecta si una linea inicia un bloque de veredicto
function matchVerdictLine(line) {
  const trimmed = line.trim();
  for (const def of VERDICT_DEFINITIONS) {
    const match = trimmed.match(def.regex);
    if (match) {
      const openedBoldBeforeIcon = Boolean(match[1]);
      let rest = (match[2] || '').trim();

      // balancea el cierre de negritas si abrio antes del icono de veredicto
      if (openedBoldBeforeIcon) {
        if (rest.startsWith('**')) {
          rest = rest.slice(2).trim();
        } else if (rest.includes('**')) {
          rest = `**${rest}`;
        }
      }

      return {
        ...def,
        rest,
      };
    }
  }
  return null;
}

// renderiza encabezados, listas y parrafos desde un arreglo de lineas
function renderStandardBlocks(lines) {
  const htmlParts = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // encabezados markdown
    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      htmlParts.push(`<h4>${formatInline(headingMatch[1])}</h4>`);
      i += 1;
      continue;
    }

    // lista con vinetas
    if (/^[-*•]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(`<li>${formatInline(lines[i].trim().replace(/^[-*•]\s+/, ''))}</li>`);
        i += 1;
      }
      htmlParts.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // lista numerada
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(`<li>${formatInline(lines[i].trim().replace(/^\d+[.)]\s+/, ''))}</li>`);
        i += 1;
      }
      htmlParts.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // parrafo normal agrupando lineas contiguas
    const paragraphLines = [];
    while (i < lines.length) {
      const curr = lines[i].trim();
      if (
        !curr ||
        /^#{1,4}\s+/.test(curr) ||
        /^[-*•]\s+/.test(curr) ||
        /^\d+[.)]\s+/.test(curr) ||
        matchVerdictLine(curr)
      ) {
        break;
      }
      paragraphLines.push(formatInline(curr));
      i += 1;
    }
    htmlParts.push(`<p>${paragraphLines.join('<br>')}</p>`);
  }

  return htmlParts.join('');
}

// construye la tarjeta html de un bloque de veredicto
function renderVerdictCard(verdict, detailLines) {
  const headerText = verdict.rest ? formatInline(verdict.rest) : `<strong>${verdict.badge}</strong>`;
  const bodyHtml = detailLines.length > 0 ? renderStandardBlocks(detailLines) : '';

  return `
    <div class="ironcito-verdict ironcito-verdict--${verdict.type}">
      <span class="ironcito-verdict-badge">${verdict.badge}</span>
      <div class="ironcito-verdict-header">
        <span class="ironcito-verdict-icon" aria-hidden="true">${verdict.icon}</span>
        <span>${headerText}</span>
      </div>
      ${bodyHtml ? `<div class="ironcito-verdict-body">${bodyHtml}</div>` : ''}
    </div>
  `;
}

// convierte markdown del asistente en html seguro con bloques de veredicto
export function parseIroncitoMarkdown(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '<p>No recibí contenido en la respuesta.</p>';
  }

  const normalized = markdown.replace(/\r\n?/g, '\n').trim();
  if (!normalized) {
    return '';
  }

  const lines = normalized.split('\n');
  const output = [];
  let buffer = [];
  let i = 0;

  const flushBuffer = () => {
    if (buffer.length > 0) {
      output.push(renderStandardBlocks(buffer));
      buffer = [];
    }
  };

  while (i < lines.length) {
    const verdict = matchVerdictLine(lines[i]);

    if (verdict) {
      flushBuffer();
      i += 1;

      // agrupa las lineas siguientes pertenecientes al mismo veredicto
      const detailLines = [];
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextTrimmed = nextLine.trim();

        if (!nextTrimmed || /^#{1,4}\s+/.test(nextTrimmed) || matchVerdictLine(nextTrimmed)) {
          break;
        }
        detailLines.push(nextLine);
        i += 1;
      }

      output.push(renderVerdictCard(verdict, detailLines));
      continue;
    }

    buffer.push(lines[i]);
    i += 1;
  }

  flushBuffer();
  return output.join('');
}
