const splitCustomWords = (input: string) => {
  let splittedText: string[] = [];

  const largeChunk = input.split("\n");

  for (const chunk of largeChunk) {
    if (chunk.length === 0) continue;
    let text = chunk;

    // Remove all equation delimiters [ and ]
    text = text.replaceAll("\\[", "\\(").replaceAll("\\]", "\\)");

    // Remove linebreak at the start of math expressions
    text = text.replaceAll("\\(\n", "\\(");
    text = text.replaceAll("\n\\)", "\\)");

    text = text.replaceAll("\\[\n", "\\(");
    text = text.replaceAll("\n\\]", "\\)");

    // Remove incomplete special characters while streaming
    if (text[text.length - 1] == "\\") {
      text = text.substring(0, text.length - 1);
    }

    // Check incomplete special characters string
    const openBracketCount = (chunk.match(/\(/g) || []).length;
    const closeBracketCount = (chunk.match(/\)/g) || []).length;

    if (openBracketCount != closeBracketCount) {
      const lastIndex = chunk.lastIndexOf("\\(");
      if (lastIndex != -1) {
        text = text.substring(0, lastIndex);
      }
    }

    // Check and remove embedded actions
    const leftActionBracketCount = (chunk.match(/⟦⟦/g) || []).length;
    const rightActionBracketCount = (chunk.match(/⟧⟧/g) || []).length;

    if (leftActionBracketCount != rightActionBracketCount) {
      const lastIndex = chunk.lastIndexOf("⟦⟦");
      if (lastIndex != -1) {
        text = text.substring(0, lastIndex);
      }
    }

    // Process text character by character to handle both bold and expressions
    const words: string[] = [];
    let currentWord: string = "";
    let isBold = false;

    // First split into words, treating expressions and action brackets as single words
    let i = 0;
    while (i < text.length) {
      // Check for action brackets start
      if (i + 1 < text.length && text[i] == "⟦" && text[i + 1] == "⟦") {
        // If we had started a word, add it to words
        if (currentWord.length != 0) {
          words.push(currentWord);
          currentWord = "";
        }

        // Collect the entire action text as one word
        let actionText = "⟦⟦";
        i += 2; // Skip '⟦⟦'

        while (i < text.length) {
          if (i + 1 < text.length && text[i] == "⟧" && text[i + 1] == "⟧") {
            actionText += "⟧⟧";
            i += 2; // Skip '⟧⟧'
            break;
          } else {
            actionText += text[i];
            i++;
          }
        }

        words.push(actionText);
      }
      // Check for expression start
      else if (i + 1 < text.length && text[i] == "\\" && text[i + 1] == "(") {
        // If we had started a word, add it to words
        if (currentWord.length != 0) {
          words.push(currentWord);
          currentWord = "";
        }

        // Collect the entire expression as one word
        let expression = "\\(";
        i += 2; // Skip '\('

        while (i < text.length) {
          if (i + 1 < text.length && text[i] == "\\" && text[i + 1] == ")") {
            expression += "\\)";
            i += 2; // Skip '\)'
            break;
          } else {
            expression += text[i];
            i++;
          }
        }

        words.push(expression);
      } else if (text[i] == " ") {
        // Space character - finish current word if any
        if (currentWord.length != 0) {
          words.push(currentWord);
          currentWord = "";
        }
        i++;
      } else {
        // Regular character - add to current word
        currentWord += text[i];
        i++;
      }
    }

    // Add any remaining word
    if (currentWord.length != 0) {
      words.push(currentWord);
    }

    // Process bold formatting
    isBold = false;
    for (const word of words) {
      // Expressions are already handled correctly
      if (word.startsWith("\\(") && word.endsWith("\\)")) {
        splittedText.push(word);
        continue;
      }

      if (word.includes("**")) {
        const numberOfBold = (word.match(/\*\*/g) || []).length;
        if (numberOfBold % 2 == 1) {
          isBold = !isBold;
        }

        if (word == "**") continue;

        splittedText.push(`**${word.replaceAll("**", "")}**`);
      } else {
        if (isBold) {
          splittedText.push("**$word**");
        } else {
          splittedText.push(word);
        }
      }
    }

    splittedText.push("\n");
  }

  while (splittedText[splittedText.length - 1] == "\n") {
    splittedText.pop();
  }

  while (splittedText[0] == "\n") {
    splittedText.shift();
  }

  splittedText = splittedText.filter((e) => e != "**");

  return splittedText;
};

export { splitCustomWords };
