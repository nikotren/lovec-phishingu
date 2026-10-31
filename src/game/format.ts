const numberFormat = new Intl.NumberFormat('cs-CZ');

export function kc(value: number): string {
  return `${numberFormat.format(value).replace('-', '−')} Kč`;
}

export function sg(value: number): string {
  return `${value > 0 ? '+' : ''}${kc(value)}`;
}

export function hue(value: string): number {
  let result = 0;
  for (const char of value) result = (result * 31 + char.charCodeAt(0)) % 360;
  return result;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function authText(auth: 'pass' | 'fail' | 'none'): string {
  if (auth === 'pass') return 'prošlo (SPF a DKIM)';
  if (auth === 'fail') return 'selhalo – odesílatel nemusí být pravý';
  return 'neověřeno';
}

export function initialsColor(name: string): string {
  const h = hue(name);
  return `linear-gradient(145deg, hsl(${h} 52% 44%), hsl(${(h + 38) % 360} 58% 30%))`;
}

export function todayCz(): string {
  return new Date().toLocaleDateString('cs-CZ');
}
