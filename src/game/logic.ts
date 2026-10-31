import type { Resolution, RunState, Rank, RunStats } from './model';

export type MailTone = 'good' | 'bad' | 'warn' | 'neu';

export function accOf(stat: { good: number; dec: number }): number {
  return stat.dec ? Math.round((100 * stat.good) / stat.dec) : 0;
}

export function rankOf(
  acc: number,
  stat: Pick<RunStats, 'creds' | 'miss' | 'fp' | 'clicks' | 'helps'>,
): Rank {
  const flawless =
    stat.creds === 0 && stat.miss === 0 && stat.fp === 0 && stat.clicks === 0 && stat.helps === 0;
  if (acc >= 95 && flawless) {
    return { id: 'master', t: 'Mistr obrany', d: 'Phishing tě nezaskočí. Tvůj tým může spát klidně.' };
  }
  if (acc >= 80) {
    return {
      id: 'hunter',
      t: 'Lovec phishingu',
      d: 'Většinu pastí jsi odhalil a víš, kam se dívat. Mistr obrany chce čistý průchod bez chyb a bez nápovědy IT.',
    };
  }
  if (acc >= 60) {
    return { id: 'guard', t: 'Strážce schránky', d: 'Dobrý základ. Zkus příští hru věnovat víc času technickým detailům.' };
  }
  return { id: 'intern', t: 'Stážista', d: 'Začátky bývají těžké. Projdi si příručku a zkus to znovu.' };
}

export function outcomeOf(
  mail: { phish: boolean },
  resolution: Resolution,
): { tone: MailTone; title: string; stamp: string } {
  if (resolution.act === 'comp') {
    return { tone: 'bad', title: 'Údaje odeslány útočníkům', stamp: 'NAPADENO' };
  }
  if (resolution.act === 'it') {
    return {
      tone: 'neu',
      title: `IT odpovídá: ${mail.phish ? 'je to phishing' : 'zpráva je v pořádku'}`,
      stamp: 'IT',
    };
  }
  if (resolution.act === 'report') {
    return mail.phish
      ? { tone: 'good', title: 'Správně, je to phishing', stamp: 'NAHLÁŠENO' }
      : { tone: 'warn', title: 'Falešný poplach, zpráva byla pravá', stamp: 'POPLACH' };
  }
  return mail.phish
    ? { tone: 'bad', title: 'Past sklapla, byl to phishing', stamp: 'NALETĚL' }
    : { tone: 'good', title: 'Správně, zpráva je v pořádku', stamp: 'V POŘÁDKU' };
}

export function multiplierOf(streak: number): number {
  return 1 + 0.1 * Math.min(streak, 5);
}

export function formatMultiplier(streak: number): string {
  return multiplierOf(streak).toFixed(1).replace('.', ',');
}

export function countRun(run: RunState) {
  const resolved = Object.keys(run.res).length;
  const reported = run.order.filter((id) => run.res[id]?.act === 'report').length;
  return { resolved, reported, remaining: run.order.length - resolved };
}
