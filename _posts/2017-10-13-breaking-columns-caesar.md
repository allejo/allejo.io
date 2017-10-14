---
title: Breaking Columnar Transposition and Caesar Cipher
date: 2017-10-13 00:00:00.00 -8
categories:
  - tutorials
tags:
  - school
  - cryptography
---

It only took until I reached my final year in college to finally find a class I found challenging and actually learned from (excluding GIS classes). I've always been fascinated by cryptography and have always wanted to learn but never found the time to do so on my own. Until I took this class, I had no knowledge of how crytography _actually_ worked. I found this assignment to be incredibly fun because it was challenging for me.

## Heads Up

When I was first given this assignment, I searched the internet to see if anyone had already solved this. That's how code works, right? (I'm looking at you, [left-pad](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm)). Unfortunately, I wasn't able to find anything. I say "unfortunately" but looking back at this, I'm really glad I didn't find anything or else I wouldn't have been able to challenge myself to figure this out.

There were several in my class that couldn't solve this assignment so I'll posting this for future readers. However, I highly recommend that if you find cryptography interesting, to skim through this post at most. It's more fun to do it on your own, trust me.

## Let's Get Started

I was given a cipher and was tasked with finding the keyword used to encrypt the plain text, and in turn, find the plain text. The plain text was encrypted using columnar transposition and a simple shift substitution.

```
HUKUUEUUYREUYYKGRRGNZZKXNGNOLKXTSAQNZYEGNZTRGTOYALSSEHSYGRVSOOLEGIKVKNZOEJYXT
```

All of this code is reliant on the [pycipher](https://pycipher.readthedocs.io/en/master/) project and uses Python 2, however it can easily be upgraded to Python 3.

## Breaking the Simple Shift Substitution

To find the shift used for this half, the approach I used was to use frequency analysis on the original cipher. Certain letters are used far more than others in any language, so we'll take advantage of that by finding the most suitable value. An example of this would be that the letter Q is used far less in English than the letter A.

The frequency of letters in the English language can be found on the Internet, so these are the values that I used for this analysis. The following code is based on [ActiveState's recipe for deciphering a caesar cipher](https://code.activestate.com/recipes/142813-deciphering-caesar-code/).

```python
ENGLISH = (0.0749, 0.0129, 0.0354, 0.0362, 0.1400, 0.0218, 0.0174, 0.0422,
           0.0665, 0.0027, 0.0047, 0.0357, 0.0339, 0.0674, 0.0737, 0.0243,
           0.0026, 0.0614, 0.0695, 0.0985, 0.0300, 0.0116, 0.0169, 0.0028,
           0.0164, 0.0004)
```

Now, we need to see how often each letter appears in our cipher text. To calculate the frequency of these letters we have a function called `letter_frequency()`.

```python
def letter_frequency(text):
    # For ease, remove all non-letter characters and convert it to lowercase for consistency.
    text = re.sub('[^a-z]', '', text.lower())

    # A dictionary to keep count of how many times each letter is used inside of `text`. They key will be the letter
    # being counted.
    alphabetCount = dict([(c,0) for c in string.lowercase])

    # Cast to float
    totalLetters = len(text) * 1.0

    for char in text:
        alphabetCount[char] += 1
    
    # Convert the dictionary to a list of items and sort them by the letter
    textLetterCount = alphabetCount.items()
    textLetterCount.sort()

    # Calculate the amount of times the letter has appeared in relation to the cipher's length
    return [ count/totalLetters for (letter,count) in textLetterCount ]
```

Now that we can calculate the frequency of letters in the cipher, we need to start calculating the deltas of each possible shift value (1 through 25). To first calculate the delta, we need a function that will calculate the difference between the frequency values we got from `letter_frequency()` and the hard coded values defined in the `ENGLISH` list.

```python
def frequency_delta(source, dest):
    N = 0.0

    for f1, f2 in zip(source, dest):
        N += abs(f1 - f2)

    return N
```

The value we get from this function will be the total change in frequencies from our potential shift and the English language letter frequencies. The lower the frequency, the better the chances of that shift being our offset value. Now, finally, we just need to loop through all 25 possible shifts and find the one with the lowest frequency.

```python
def decipher_caesar(cipher):
    lowestDelta = 1000 # A ridiculously large initial delta in order to ensure a new lowest delta
    bestRotation = 0
    letterFrequencies = letter_frequency(cipher)

    for shift in range(26):
        currentDelta = frequency_delta(letterFrequencies[shift:] + letterFrequencies[:shift], ENGLISH)

        if currentDelta < lowestDelta:
            lowestDelta = currentDelta
            bestRotation = shift

    return {
        'rotation': bestRotation,
        'plain_text': Caesar(bestRotation).decipher(cipher)
    }
```

After we run the `decipher_caesar()` function on our initial cipher, we get the following information:

- Lowest delta frequency: `0.478501298701`
- Rotation: `6`
- Plain Text: `BOEOOYOOSLYOSSEALLAHTTERHAHIFERNMUKHTSYAHTNLANISUFMMYBMSALPMIIFYACEPEHTIYDSRN`

## Breaking Columnar Transposition

Breaking this isn't quick and easy like the Caesar cipher but that doesn't mean it's difficult either; it's just very time consuming once you get the concept of it.

[Columnar transposition](https://en.wikipedia.org/wiki/Transposition_cipher#Columnar_transposition) makes use of a keyword to encrypt text; however, two different keywords could possibly encrypt the same plain text the same way. For example, using CAT and BAT as keywords would encrypt to the same result since they'd both order the columns as `213`. We can use this fact to our advantage and just use numbers when trying to find possible keywords.

The length of the keyword is important and without knowing this information, it makes finding the keyword take far longer since we'll have to try out different lengths. To represent our keyword, I'll be using numbers. Since I'm writing this after I figured out the keyword, I know the length is 8 so we'll be using 8 numbers: `01234567` ([because arrays start at 0](https://www.reddit.com/r/ProgrammerHumor/comments/6m7z9o/arrays_start_at_one_police_edition/)).

The first step we need to do is create all of the possible permutations of our potential keyword, meaning we'd have a list looking like:

```
01234567
02134567
02314567
...
...
```

Don't worry, we'll build them all with [`itertools.permutations`](https://docs.python.org/2/library/itertools.html#itertools.permutations).

```python
import itertools

permutations = itertools.permutations('01234567')
```

Now that we have every possible permutation, 40,320 to be exact, or 8[!](https://en.wikipedia.org/wiki/Factorial), we need to undo the columnar transposition of the cipher text with each permutation and save it.

```python
from pycipher import ColTrans

def brute_columnar_transposition(text, keyword):
    possible_orders = permutations(keyword)
    columnPositions = {}

    for order in possible_orders:
        key = ''.join(order)
        columnPositions[key] = ColTrans(key).decipher(text)

    return columnPositions
```

With this function, we'll be getting every possible arrangement of the cipher's columns. But that's still 42,320 combinations. Unless you are _really_ bored to do it manually, it's necessary to use a dictionary attack on all of these combinations and then find which version has the most English words.

I highly recommend you do **not** use your OS' dictionary if you're on Unix. Why?

```
allejo$ wc -l /usr/share/dict/words
235886 /usr/share/dict/words
```

What's worse is that these words are in alphabetical order, which will take forever to find a word such as "which" that is used frequently. To solve this issue, we need a shorter list of common English words (ideally sorted by frequency). Thankfully, someone on GitHub did just that and built a list containing the [10,000 most common English words in order of frequency](https://github.com/first20hours/google-10000-english).

```python
# Build a list of English words from a file that's delimited by new lines
def build_dictionary():
    with open('10k-english.txt', 'r') as dict_file:
        return dict_file.read().split()
```

Now that we have a dictionary and all of the possible ordering of cipher columns, we'll perform the dictionary attack and we will write all of this information to a text file because it'll be a lot.

```python
combinations = brute_columnar_transposition(
    'BOEOOYOOSLYOSSEALLAHTTERHAHIFERNMUKHTSYAHTNLANISUFMMYBMSALPMIIFYACEPEHTIYDSRN'
)

def dictionary_attack(permutations, words, output = 'iambrute.txt'):
    results = {}

    for cols, string in permutations.iteritems():
        results[string] = {
            'cols': cols,
            'words': []
        }

        for _word in words:
            word = _word.strip().upper()

            if len(word) < 3:
                continue

            if word in string:
                results[string]['words'].append(word)

    sortedResults = OrderedDict(sorted(
        results.iteritems(), 
        key=lambda x: len(x[1]['words']), 
        reverse=True
    ))

    with open(output, 'w') as data_file:
        for k in sortedResults:
            line = "{}: [{}]\n".format(
                ', '.join([ sortedResults[k]['cols'], k ]),
                ', '.join(sortedResults[k]['words'])
            )
            data_file.write(line)

    return results
```

During the process of finding English words, we are ignoring any words less than 3 letters long and making a list of words that exist in each of the combinations. Ideally, you'd want to ignore overlapping words so you don't find "THE" and "EAT" inside of "THEATER". However, it never hurts to find more words within already existing words; it'll increase its ranking.

Once we finish finding all of the words that exist in each of the combinations, we create an [OrderedDict](https://docs.python.org/2/library/collections.html#collections.OrderedDict) sorted by the amount of words that exist in the string in descending order so the string with the most words will be at the beginning of the file.

## Results

I've made [my code available on GitHub](https://github.com/allejo/iambrute) for you to explore and learn from. Since the code's public, it has likely been indexed by Google, meaning: if you found it, so can your professor. Don't get caught cheating.

Here's the plain text I got from my cipher.

- Column Order: `03247615`
- Plain Text: `BEHAPPYFORTHEMOMENTTHISMOMENTISYOURLIFEBYKHAYYAMOHANDALSOTHISCLASSISREALLYFUN:`
- Words Found: `[THE, AND, FOR, THIS, YOU, YOUR, ALL, OUR, HIS, ALSO, THEM, LIFE, REAL, CLASS, MEN, REALLY, HAND, FUN, FEB, URL, HAPPY, LAS, MOMENT, FORT, MOM, FORTH, APP, ENT, MENT, HAY]`
