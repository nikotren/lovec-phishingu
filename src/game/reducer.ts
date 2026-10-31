import { produce } from 'immer';
import { BADGE_BY_ID, BY_ID, SHIFTS, TYPES, TYPE_KEYS } from './content';
import { accOf, multiplierOf, rankOf } from './logic';
import type { Action, AppState, Resolution, RunState, SfxName, ToastTone, FxType } from './model';
import { loadProfile } from './storage';

function emptyStats() {
  return { good: 0, dec: 0, fp: 0, miss: 0, clicks: 0, creds: 0, helps: 0 };
}

function createRun(): RunState {
  return {
    shift: 0,
    money: 5000,
    hearts: 3,
    streak: 0,
    it: 2,
    order: [],
    res: {},
    marks: {},
    trap: {},
    read: {},
    sel: null,
    details: false,
    over: false,
    stat: emptyStats(),
    sh: { wrong: 0, clicks: 0 },
    snap: { money: 5000, streak: 0, stat: emptyStats() },
    newBadges: [],
    runBadges: [],
    bonuses: null,
    bonusTot: 0,
    acc: 0,
    rank: null,
  };
}

function beginShift(run: RunState, index: number): void {
  run.shift = index;
  run.hearts = 3;
  run.it = 2;
  // Mails stay in chronological order so the times and the daily context make sense.
  run.order = SHIFTS[index].mails.slice();
  run.res = {};
  run.marks = {};
  run.trap = {};
  run.read = {};
  run.sel = null;
  run.details = false;
  run.over = false;
  run.sh = { wrong: 0, clicks: 0 };
  run.bonuses = null;
  run.bonusTot = 0;
  run.acc = 0;
  run.rank = null;
  run.snap = {
    money: run.money,
    streak: run.streak,
    stat: { ...run.stat },
  };

  const first = run.order[0] ?? null;
  run.sel = first;
  if (first !== null) run.read[first] = true;
}

export function createInitialState(): AppState {
  return {
    profile: loadProfile(),
    run: null,
    view: 'title',
    archiveReturn: null,
    tab: 'lib',
    confirmReset: false,
    toasts: [],
    sound: null,
    fx: null,
    seq: 1,
  };
}

export function gameReducer(state: AppState, action: Action): AppState {
  return produce(state, (draft) => {
    const sounds: SfxName[] = [];

    const play = (name: SfxName) => {
      sounds.push(name);
    };

    const toast = (message: string, tone: ToastTone = 'default') => {
      draft.toasts.push({ id: ++draft.seq, message, tone });
      if (draft.toasts.length > 4) draft.toasts.shift();
    };

    const fx = (type: FxType) => {
      draft.fx = { id: ++draft.seq, type };
    };

    const unlockType = (mailType: string) => {
      if (draft.profile.unlocked[mailType]) return;
      draft.profile.unlocked[mailType] = true;
      if (TYPES[mailType]) {
        toast(`Nová kapitola příručky: ${TYPES[mailType].n}`, 'success');
        play('ding');
      }
    };

    const markType = (mailType: string, correct: boolean) => {
      const current = draft.profile.ts[mailType] ?? { ok: 0, n: 0 };
      draft.profile.ts[mailType] = {
        ok: current.ok + (correct ? 1 : 0),
        n: current.n + 1,
      };
      unlockType(mailType);
    };

    const award = (id: string, quiet = false) => {
      const badge = BADGE_BY_ID[id];
      if (!badge || draft.profile.badges[id]) return;
      draft.profile.badges[id] = Date.now();
      if (draft.run && !draft.run.newBadges.includes(id)) draft.run.newBadges.push(id);
      if (draft.run && !draft.run.runBadges.includes(id)) draft.run.runBadges.push(id);
      if (quiet) return;
      toast(`Nový odznak: ${badge.n}`, 'badge');
      play('ding');
    };

    const endShift = () => {
      const run = draft.run;
      if (!run) return;
      const perfect = run.sh.wrong === 0 && run.sh.clicks === 0;
      const bonuses: Array<[string, number]> = [];
      if (perfect) {
        bonuses.push(['Bezchybná směna', 1000]);
        award('clean', true);
      }
      if (run.hearts > 0) {
        bonuses.push([`Zbývající důvěra (${run.hearts}×)`, run.hearts * 200]);
      }
      const total = bonuses.reduce((sum, bonus) => sum + bonus[1], 0);
      run.money += total;
      run.bonuses = bonuses;
      run.bonusTot = total;
      draft.toasts = [];
      draft.view = 'shiftEnd';
      fx('complete');
      play('complete');
    };

    const finishRun = () => {
      const run = draft.run;
      if (!run) return;
      draft.toasts = [];
      draft.profile.runs += 1;
      draft.profile.cleared += 1;
      draft.profile.best = Math.max(draft.profile.best, run.money);
      const acc = accOf(run.stat);
      run.acc = acc;
      run.rank = rankOf(acc, run.stat);
      award('grad', true);
      if (run.stat.fp === 0) award('nopanic', true);
      if (run.stat.clicks === 0 && run.stat.creds === 0) award('nokick', true);
      if (run.rank.id === 'master') award('master', true);
      draft.view = 'final';
      fx('win');
      play('win');
    };

    switch (action.type) {
      case 'START': {
        draft.profile.name = draft.profile.name.trim();
        const run = createRun();
        beginShift(run, 0);
        run.newBadges = [];
        draft.run = run;
        draft.view = 'brief';
        draft.archiveReturn = null;
        draft.confirmReset = false;
        play('click');
        break;
      }

      case 'SET_NAME': {
        draft.profile.name = action.name.slice(0, 28);
        break;
      }

      case 'PLAY': {
        if (!draft.run) break;
        draft.view = 'game';
        if (draft.run.sel === null) {
          const first = draft.run.order[0] ?? null;
          draft.run.sel = first;
          if (first !== null) draft.run.read[first] = true;
        }
        play('click');
        break;
      }

      case 'SELECT': {
        const run = draft.run;
        if (!run) break;
        run.sel = action.id;
        run.read[action.id] = true;
        run.details = false;
        play('click');
        break;
      }

      case 'TOGGLE_DETAILS': {
        if (!draft.run) break;
        draft.run.details = !draft.run.details;
        play('click');
        break;
      }

      case 'TOGGLE_MARK': {
        const run = draft.run;
        if (!run || run.sel === null || run.res[run.sel] || run.over) break;
        const marks = run.marks[run.sel] ?? [];
        const index = marks.indexOf(action.key);
        if (index >= 0) marks.splice(index, 1);
        else marks.push(action.key);
        run.marks[run.sel] = marks;
        play('mark');
        break;
      }

      case 'DECIDE': {
        const run = draft.run;
        if (!run || run.over || run.sel === null) break;
        const mail = BY_ID[run.sel];
        if (!mail || run.res[mail.id]) break;
        if (action.act === 'it' && !run.it) break;

        const marks = run.marks[mail.id] ?? [];
        const found = marks.filter((key) => Boolean(mail.clues[key])).length;
        const total = Object.keys(mail.clues).length;
        const multiplier = multiplierOf(run.streak);
        const resolution: Resolution = { act: action.act, lines: [], pts: 0, ok: null };

        const gainMultiplier = (base: number, label: string) => {
          const bonus = Math.round((base * (multiplier - 1)) / 10) * 10;
          resolution.lines.push([label, base]);
          if (bonus) resolution.lines.push([`Série ×${multiplier.toFixed(1).replace('.', ',')}`, bonus]);
          return base + bonus;
        };

        if (action.act === 'it') {
          run.it -= 1;
          run.stat.helps += 1;
          resolution.pts = -250;
          resolution.lines.push(['Dotaz na IT', -250]);
          unlockType(mail.type);
          play('click');
        } else {
          const correct = (action.act === 'report') === mail.phish;
          resolution.ok = correct;
          run.stat.dec += 1;

          if (correct) {
            if (mail.phish) {
              let points = gainMultiplier(500, 'Správné nahlášení');
              if (found) {
                const cluePoints = found * 50;
                resolution.lines.splice(1, 0, [`Stopy (${found}/${total})`, cluePoints]);
                points += cluePoints;
              }
              resolution.pts = points;
              if (found === total && total > 0) draft.profile.fullClues += 1;
              award('first');
            } else {
              resolution.pts = gainMultiplier(200, 'Pravou zprávu ponechat');
            }
            run.streak += 1;
            run.stat.good += 1;
            play('good');
            fx('good');
          } else {
            run.streak = 0;
            if (action.act === 'report') {
              resolution.pts = -300;
              resolution.lines.push(['Falešný poplach', -300]);
              run.stat.fp += 1;
            } else {
              resolution.pts = -1500;
              resolution.lines.push(['Naletěl jsi (ztráta důvěry)', -1500]);
              run.hearts -= 1;
              run.stat.miss += 1;
              resolution.heart = true;
              play('heart');
            }
            run.sh.wrong += 1;
            play('bad');
            fx('danger');
          }
          markType(mail.type, correct);
        }

        run.money += resolution.pts;
        run.res[mail.id] = resolution;
        if (run.hearts <= 0) run.over = true;
        if (run.streak >= 8) award('streak8');
        if (draft.profile.fullClues >= 5) award('detective');
        if (TYPE_KEYS.every((key) => draft.profile.unlocked[key])) award('collector');
        break;
      }

      case 'COMPROMISE': {
        const run = draft.run;
        if (!run || run.over) break;
        const mail = BY_ID[action.id];
        if (!mail || run.res[mail.id]) break;

        run.money -= 2000;
        run.hearts -= 1;
        run.streak = 0;
        run.sh.wrong += 1;
        run.stat.creds += 1;
        run.stat.dec += 1;
        markType(mail.type, false);
        run.res[mail.id] = {
          act: 'comp',
          ok: false,
          pts: -2000,
          lines: [['Údaje odeslány útočníkům', -2000]],
          heart: true,
        };
        if (run.hearts <= 0) run.over = true;
        play('bad');
        play('heart');
        fx('danger');
        break;
      }

      case 'NEXT': {
        const run = draft.run;
        if (!run) break;
        // The current message must be resolved first; this also makes a double click harmless.
        if (run.sel === null || !run.res[run.sel]) break;
        if (run.hearts <= 0) {
          draft.view = 'over';
          fx('danger');
          play('bad');
          break;
        }
        const unresolved = run.order.filter((id) => !run.res[id]);
        if (!unresolved.length) {
          endShift();
          break;
        }
        const currentIndex = run.sel === null ? -1 : run.order.indexOf(run.sel);
        const after =
          run.order
            .slice(currentIndex + 1)
            .concat(run.order.slice(0, Math.max(0, currentIndex)))
            .find((id) => !run.res[id]) ?? unresolved[0];
        run.sel = after;
        run.read[after] = true;
        run.details = false;
        draft.view = 'game';
        play('click');
        break;
      }

      case 'NEXT_SHIFT': {
        const run = draft.run;
        if (!run) break;
        run.newBadges = [];
        const isLast = run.shift >= SHIFTS.length - 1;
        if (isLast) {
          finishRun();
        } else {
          beginShift(run, run.shift + 1);
          draft.view = 'brief';
          play('click');
        }
        break;
      }

      case 'RETRY': {
        const run = draft.run;
        if (!run) break;
        run.money = run.snap.money;
        run.streak = run.snap.streak;
        run.stat = { ...run.snap.stat };
        run.newBadges = [];
        beginShift(run, run.shift);
        draft.view = 'game';
        play('click');
        break;
      }

      case 'GO_TITLE': {
        draft.view = 'title';
        draft.run = null;
        draft.archiveReturn = null;
        draft.confirmReset = false;
        play('click');
        break;
      }

      case 'ARCHIVE': {
        if (draft.view !== 'archive') draft.archiveReturn = draft.view;
        draft.view = 'archive';
        draft.confirmReset = false;
        play('click');
        break;
      }

      case 'BACK_FROM_ARCHIVE': {
        const target = draft.archiveReturn;
        draft.archiveReturn = null;
        draft.confirmReset = false;
        draft.view = target && (target !== 'game' || draft.run) ? target : 'title';
        play('click');
        break;
      }

      case 'TAB': {
        draft.tab = action.tab;
        draft.confirmReset = false;
        break;
      }

      case 'RESET_PROGRESS': {
        if (!draft.confirmReset) {
          draft.confirmReset = true;
          break;
        }
        draft.profile.best = 0;
        draft.profile.runs = 0;
        draft.profile.cleared = 0;
        draft.profile.unlocked = {};
        draft.profile.ts = {};
        draft.profile.badges = {};
        draft.profile.fullClues = 0;
        draft.confirmReset = false;
        toast('Uložený postup byl smazán.', 'success');
        play('click');
        break;
      }

      case 'TOGGLE_MUTE': {
        draft.profile.muted = !draft.profile.muted;
        if (!draft.profile.muted) play('click');
        break;
      }

      case 'SET_THEME': {
        draft.profile.theme = action.theme;
        break;
      }

      case 'LINK_OPENED': {
        const run = draft.run;
        if (!run) break;
        const mail = BY_ID[action.id];
        if (!mail || run.res[action.id] || run.over) break;
        if (mail.phish && mail.trap) {
          const trap = run.trap[action.id] ?? {};
          if (!trap.clicked) {
            trap.clicked = true;
            run.trap[action.id] = trap;
            run.money -= 500;
            run.streak = 0;
            run.sh.clicks += 1;
            run.stat.clicks += 1;
          }
        }
        break;
      }

      case 'TRAP_CLOSED': {
        const run = draft.run;
        if (!run || run.sel === null) break;
        const mail = BY_ID[run.sel];
        if (!mail || run.res[mail.id]) break;
        if (mail.phish && mail.trap && run.trap[mail.id]?.clicked) {
          toast('Zavřel jsi stránku včas. Otevření podezřelého odkazu ale stálo 500 Kč.', 'danger');
          play('bad');
        }
        break;
      }

      case 'TOAST': {
        toast(action.message, action.tone ?? 'default');
        break;
      }

      case 'DISMISS_TOAST': {
        draft.toasts = draft.toasts.filter((item) => item.id !== action.id);
        break;
      }

      default:
        break;
    }

    if (sounds.length) {
      draft.sound = { id: ++draft.seq, names: sounds };
    }
  });
}
