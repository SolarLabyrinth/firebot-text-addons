# Firebot Text Addons

My utility functions for string manipulation in firebot.

## Installation

Copy the provided .js file from the releases tab into your firebot custom scripts folder.

## Provided Functions

- hasNonAscii[text] -> boolean
- hasConfusable[text] -> boolean
- cleanConfusables[text] -> text
- toConfusables[text] -> text
- hasProfanity[text] -> boolean
- replaceWords[text, metadata-key] -> text
  - Replaces standalone usernames and @mentions in the provided text with the value contained in the user's metadata entry for the provided metadata-key.
- pronoun[they, username] -> boolean
  - Uses the provided "they/them/their/theirs/themself" pronoun in the first argument to pick the user's specific pronoun for the grammatical case represented by that first argument.
  - Uses a user's primary pronoun from https://pr.alejo.io/. Should support all pronouns able to be set on that site. Defaults to the provided first argument if no pronoun is set.
  - ex) "Go check out $pronoun[their, $username] channel!" will become: "Go check out his channel!" if the user has he set as their primary pronoun as "he"
  - ex) "That is $pronoun[theirs, $username]!" will become: "That is hers!" if the user has he set as their primary pronoun as "she"

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
