const subsChrs = " !#$%&'()*+,-./<=>?@[]^_`{|}~";
const Word = /^[a-z]*$/i;
function unfold(words, sep) {
    let initial = 97;
    return words.reduce((accum, word) => {
        if (word === sep) {
            initial++;
        }
        else if (word.match(Word)) {
            accum.push(String.fromCharCode(initial) + word);
        }
        else {
            initial = 97;
            accum.push(word);
        }
        return accum;
    }, []);
}
export function decode(data, subs) {
    // Replace all the substitutions with their expanded form
    for (let i = subsChrs.length - 1; i >= 0; i--) {
        data = data.split(subsChrs[i]).join(subs.substring(2 * i, 2 * i + 2));
    }
    // Get all tle clumps; each suffix, first-increment and second-increment
    const clumps = [];
    const leftover = data.replace(/(:|([0-9])|([A-Z][a-z]*))/g, (all, item, semi, word) => {
        if (semi) {
            for (let i = parseInt(semi); i >= 0; i--) {
                clumps.push(";");
            }
        }
        else {
            clumps.push(item.toLowerCase());
        }
        return "";
    });
    if (leftover) {
        throw new Error(`leftovers: ${JSON.stringify(leftover)}`);
    }
    return unfold(unfold(clumps, ";"), ":");
}
export function decodeOwl(data) {
    if (data[0] !== "0") {
        throw TypeError("unsupported auwl data");
    }
    return decode(data.substring(1 + 2 * subsChrs.length), data.substring(1, 1 + 2 * subsChrs.length));
}
//# sourceMappingURL=decode-owl.js.map