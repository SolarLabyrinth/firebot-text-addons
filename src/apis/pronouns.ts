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

function getPrimaryPronoun(pronouns: string) {
  return pronouns.split("/")[0];
}

async function fetchPrimaryPronoun(username: string) {
  const pronounId = await fetchPronounId(username);
  const pronouns = await getPronounsById(pronounId);

  if (!pronouns) return null;

  const primaryPronoun = getPrimaryPronoun(pronouns);

  return primaryPronoun;
}
