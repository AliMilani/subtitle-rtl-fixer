import { readFile, writeFile } from 'fs';
const bidiCharacters = {
    'R': ['\u05BE', '\u05C0', '\u05C3', '\u05C6', '\u05D0-\u05EA', '\u05F0-\u05F4', '\u061B', '\u061F', '\u0621-\u063A', '\u0640-\u064A', '\u066D-\u066F', '\u0671-\u06D5', '\u06E5-\u06E6', '\u06EE-\u06EF', '\u06FA-\u0710', '\u0712-\u072F', '\u074D-\u07A5', '\u07B1', '\u07C0-\u07EA', '\u07F4-\u07F5', '\u07FA', '\u0800-\u0815', '\u081A', '\u0824', '\u0828', '\u0830-\u0858', '\u085E', '\u08A0', '\u08A2-\u08AC', '\u08E4-\u08FE', '\uFB1D-\uFB36', '\uFB38-\uFB3C', '\uFB3E', '\uFB40-\uFB41', '\uFB43-\uFB44', '\uFB46-\uFBC1', '\uFBD3-\uFD3D', '\uFD50-\uFD8F', '\uFD92-\uFDC7', '\uFDF0-\uFDFC', '\uFE70-\uFE74', '\uFE76-\uFEFC', '\u10800-\u1091B', '\u10920-\u10A00', '\u10A10-\u10A33', '\u10A40-\u10A47', '\u10A50-\u10A58', '\u10A60-\u10A7F', '\u10A80-\u10A9F', '\u10AC0-\u10AE6', '\u10B00-\u10B35', '\u10B40-\u10B55', '\u10B60-\u10B72', '\u10B80-\u10B91', '\u10BA9-\u10BAF', '\u10C00-\u10C48', '\u1EE00-\u1EE03', '\u1EE05-\u1EE1F', '\u1EE21-\u1EE22', '\u1EE24', '\u1EE27', '\u1EE29-\u1EE32', '\u1EE34-\u1EE37', '\u1EE39', '\u1EE3B', '\u1EE42', '\u1EE47', '\u1EE49', '\u1EE4B', '\u1EE4D-\u1EE4F', '\u1EE51-\u1EE52', '\u1EE54', '\u1EE57', '\u1EE59', '\u1EE5B', '\u1EE5D', '\u1EE5F', '\u1EE61-\u1EE62', '\u1EE64', '\u1EE67-\u1EE6A', '\u1EE6C-\u1EE72', '\u1EE74-\u1EE77', '\u1EE79-\u1EE7C', '\u1EE7E', '\u1EE80-\u1EE89', '\u1EE8B-\u1EE9B', '\u1EEA1-\u1EEA3', '\u1EEA5-\u1EEA9', '\u1EEAB-\u1EEBB'],
    'AL': ['\u0608', '\u060B', '\u060D', '\u0610-\u061A', '\u0620', '\u064B-\u065F', '\u066A-\u066C', '\u06D6-\u06DC', '\u06DE-\u06E4', '\u06E7-\u06E8', '\u06F0-\u06F9', '\u0711', '\u0730-\u074A', '\u07A6-\u07B0', '\u07EB-\u07F3', '\u07F6-\u07F9', '\u08A1', '\u08AD-\u08E3', '\u10837-\u10838', '\u1083C', '\u10B78-\u10B7F', '\u11000-\u11002', '\u11038-\u11046', '\u11066-\u1106F', '\u1107F-\u11081', '\u110B3-\u110B6', '\u110B9-\u110BA', '\u11100-\u11102', '\u11127-\u1112B', '\u1112D-\u11134', '\u11136-\u1113F', '\u11173', '\u11180-\u11181', '\u111B6-\u111BE', '\u111BF-\u111C1', '\u111C5-\u111C8', '\u111D0-\u111D9', '\u116AC', '\u116AE-\u116AF', '\u116B6', '\u116C0-\u116C9', '\u16F51-\u16F7E', '\u16F8F-\u16F92', '\u1D165-\u1D169', '\u1D16D-\u1D172', '\u1D17B-\u1D182', '\u1D185-\u1D18B', '\u1D1AA-\u1D1AD', '\u1D242-\u1D244', '\u1DA00-\u1DA36', '\u1DA3B-\u1DA6C', '\u1DA75', '\u1DA84', '\u1DA9B-\u1DA9F', '\u1DAA1-\u1DAAF']
    // Add other bidi categories as needed
};

function isRtl(char) {
    for (const [key, ranges] of Object.entries(bidiCharacters)) {
        for (const range of ranges) {
            const [start, end] = range.split('-').map(c => c.charCodeAt(0));
            if (char.charCodeAt(0) >= start && char.charCodeAt(0) <= (end || start)) {
                return key === 'R' || key === 'AL';
            }
        }
    }
    return false;
}

function dominantStrongDirection(s) {
    let rtlCount = 0;
    let ltrCount = 0;
    for (const char of s) {
        if (isRtl(char)) {
            rtlCount++;
        } else {
            ltrCount++;
        }
    }
    return rtlCount > ltrCount ? 'rtl' : 'ltr';
}

function fixSubtitles(filename) {
    readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = data.split('\n');
        let newContent = '';

        for (const line of lines) {
            if (line.match(/^\d+$/) || line.match(/^[0-9:, -->]+$/)) {
                newContent += line + '\n';
                continue;
            }

            if (dominantStrongDirection(line) === 'rtl') {
                newContent += '\u202b' + line + '\u202c' + '\n';
            } else {
                newContent += line + '\n';
            }
        }

        writeFile(filename, newContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Subtitles fixed successfully.');
        });
    });
}

// Replace 'file.srt' with the path to your subtitle file
fixSubtitles('file.srt');
