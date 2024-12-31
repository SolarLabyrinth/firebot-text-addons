import { registerReplaceVariable } from "../firebot/replace-variables";
import { ScriptRunRequest } from "../firebot/types";

const cachedPronouns = new Map([
  ["hehim", "He/Him"],
  ["sheher", "She/Her"],
  ["theythem", "They/Them"],
  ["shethem", "She/They"],
  ["hethem", "He/They"],
  ["heshe", "He/She"],
  ["xexem", "Xe/Xem"],
  ["faefaer", "Fae/Faer"],
  ["vever", "Ve/Ver"],
  ["aeaer", "Ae/Aer"],
  ["ziehir", "Zie/Hir"],
  ["perper", "Per/Per"],
  ["eem", "E/Em"],
  ["itits", "It/Its"],
  ["any", "Any"],
]);

const aeCases = new Map([
  ["they", "Ae"],
  ["them", "Aer"],
  ["their", "Aers"],
  ["theirs", "Aers"],
  ["themself", "Aerself"],
]);
const anyCases = new Map([
  ["they", "They"],
  ["them", "Them"],
  ["their", "Their"],
  ["theirs", "Theirs"],
  ["themself", "Themself"],
]);
const eCases = new Map([
  ["they", "E"],
  ["them", "Em"],
  ["their", "Eir"],
  ["theirs", "Eirs"],
  ["themself", "Emself"],
]);
const faeCases = new Map([
  ["they", "Fae"],
  ["them", "Faer"],
  ["their", "Faer"],
  ["theirs", "Faers"],
  ["themself", "Faerself"],
]);
const heCases = new Map([
  ["they", "He"],
  ["them", "Him"],
  ["their", "His"],
  ["theirs", "His"],
  ["themself", "Himself"],
]);
const itCases = new Map([
  ["they", "It"],
  ["them", "It"],
  ["their", "Its"],
  ["theirs", "Its"],
  ["themself", "Itself"],
]);
const perCases = new Map([
  ["they", "Per"],
  ["them", "Per"],
  ["their", "Per"],
  ["theirs", "Pers"],
  ["themself", "Perself"],
]);
const sheCases = new Map([
  ["they", "She"],
  ["them", "Her"],
  ["their", "Her"],
  ["theirs", "Hers"],
  ["themself", "Herself"],
]);
const theyCases = new Map([
  ["they", "They"],
  ["them", "Them"],
  ["their", "Their"],
  ["theirs", "Theirs"],
  ["themself", "Themself"],
]);
const veCases = new Map([
  ["they", "Ve"],
  ["them", "Ver"],
  ["their", "Ver"],
  ["theirs", "Vers"],
  ["themself", "Verself"],
]);
const xeCases = new Map([
  ["they", "Xe"],
  ["them", "Xem"],
  ["their", "Xyr"],
  ["theirs", "Xyrs"],
  ["themself", "Xemself"],
]);
const zieCases = new Map([
  ["they", "Zie"],
  ["them", "Hir"],
  ["their", "Hir"],
  ["theirs", "Hirs"],
  ["themself", "Hirself"],
]);

const defaultCases = theyCases;

const caseMaps = new Map([
  ["ae", aeCases],
  ["any", anyCases],
  ["e", eCases],
  ["fae", faeCases],
  ["he", heCases],
  ["it", itCases],
  ["per", perCases],
  ["she", sheCases],
  ["they", theyCases],
  ["ve", veCases],
  ["xe", xeCases],
  ["zie", zieCases],
]);

async function fetchPronounCodes() {
  const response = await fetch("https://pronouns.alejo.io/api/pronouns");
  const data: { display: string; name: string }[] = await response.json();
  return data;
}

async function getPronounsById(pronounId: string | undefined) {
  if (!pronounId) return;

  let pronouns = cachedPronouns.get(pronounId);

  if (!pronouns) {
    const pronounCodes = await fetchPronounCodes();
    pronouns = pronounCodes.find(
      (pronoun) => pronoun.name === pronounId
    )?.display;

    if (pronouns) {
      cachedPronouns.set(pronounId, pronouns);
    }
  }

  return pronouns;
}

async function fetchPronounId(username: string) {
  try {
    const response = await fetch(
      `https://pronouns.alejo.io/api/users/${username}`
    );
    const data = await response.json();
    const id: string | undefined = data[0].pronoun_id || undefined;
    return id;
  } catch {
    return undefined;
  }
}

function parsePrimaryPronoun(pronouns: string) {
  return pronouns.split("/")[0];
}

async function fetchPrimaryPronoun(username: string) {
  const pronounId = await fetchPronounId(username);
  const pronouns = await getPronounsById(pronounId);

  if (!pronouns) return null;

  const primaryPronoun = parsePrimaryPronoun(pronouns);

  return primaryPronoun;
}

async function getRawPronounForCase(username: string, _case: string) {
  const caseLower = _case.toLowerCase();

  const primaryPronoun = await fetchPrimaryPronoun(username);
  if (!primaryPronoun) return defaultCases.get(caseLower) ?? _case;

  const caseMap = caseMaps.get(primaryPronoun.toLocaleLowerCase());
  if (!caseMap) return defaultCases.get(caseLower) ?? _case;

  return caseMap.get(caseLower) ?? _case;
}

export async function getPronounForCase(username: string, _case: string) {
  const rawPronoun = await getRawPronounForCase(username, _case);

  const isLowerCase = _case.toLowerCase() === _case;
  const isAllCaps = _case.toUpperCase() === _case;

  if (isLowerCase) return rawPronoun.toLowerCase();
  if (isAllCaps) return rawPronoun.toUpperCase();
  return rawPronoun;
}

export function registerPronoun(runRequest: ScriptRunRequest) {
  registerReplaceVariable(runRequest, {
    definition: {
      handle: "pronoun",
      description: `Replaces the provided pronoun with the corresponding pronoun for the user according to https://pronouns.alejo.io/. Defaults to the provided pronoun if the user has not set their pronouns.`,
      usage: "pronoun[they, username]",
      examples: [
        {
          usage: "pronoun[they, username]",
          description: `Returns he, she, they, etc.`,
        },
        {
          usage: "pronoun[They, username]",
          description: `Returns He, She, They, etc.`,
        },
        {
          usage: "pronoun[THEY, username]",
          description: `Returns HE, SHE, THEY, etc.`,
        },
        {
          usage: "pronoun[their, username]",
          description: `Returns his, her, their, etc.`,
        },
      ],
      possibleDataOutput: ["text"],
      categories: ["advanced", "text"],
    },
    evaluator(_, _case: string, username: string) {
      return getPronounForCase(username, _case);
    },
  });
}
