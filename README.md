# Firebot Text Addons

My utility functions for string manipulation in firebot.

## Installation

Copy the provided .js file from the releases tab into your firebot custom scripts folder. Then enable it in the settings.

## Provided Functions

- hasNonAscii[text] -> boolean
- hasConfusable[text] -> boolean
- cleanConfusables[text] -> text
- toConfusables[text] -> text
- hasProfanity[text] -> boolean
- replaceWords[text, metadata-key] -> text
  - Replaces standalone usernames and @mentions in the provided text with the value contained in the user's metadata entry for the provided metadata-key.
  - Also replaces any words present in the global script config. Info below.
- pronoun[they, username] -> text

## Pronouns

```
$pronoun[they, $username]
```
Uses the provided "they/them/their/theirs/themself" pronoun in the first argument to pick the user's specific pronoun for the grammatical case represented by that first argument.

Uses a user's primary pronoun from https://pr.alejo.io/. Should support all pronouns able to be set on that site. Defaults to the provided first argument if no pronoun is set.

|Macro|He Output|She Output|They/Default Output|
|-|-|-|-|
|$pronoun[they, $username]|he|she|they|
|$pronoun[them, $username]|him|her|them|
|$pronoun[their, $username]|his|her|their|
|$pronoun[theirs, $username]|his|hers|theirs|
|$pronoun[themself, $username]|himself|herself|themself|
|$pronoun[They, $username]|He|She|They|
|$pronoun[THEY, $username]|HE|SHE|THEY|

## Config

### Replacement Text (CSV)

A CSV file of words and their replacements. 2 columns per row. Column 1 is the word to replace. Column 2 is the word to replace it with.

#### Example:

To replace "hi" with "yo" and "large" with "small" enter this:

```
hi,yo
large,small
```

### Allowed Words

Profanity is detected via the npm obscenity package. It may flag more words then you want. This allows you to enter a comma separated list of words to allow in the profanity checker.

```
arse,turd
```
