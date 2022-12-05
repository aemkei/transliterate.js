function obfuscate(alphabet, code) {

  alphabet = [... alphabet];

  var invalid = alphabet.filter(function(char) {
    var valid = true;

    try {
      eval(`${char} = 1`);
    } catch (e) {
      valid = false;
    }
    return !valid;
  });

  if (invalid.length) {
    return `Invalid identifier name: ${invalid}. <br>
      Read more here:
      https://mathiasbynens.be/notes/javascript-identifiers`;
  }

  alphabet = alphabet.filter(function(char, index) {
    return index <= alphabet.indexOf(char);
  });

  if (alphabet.length < 9) {
    return 'Please enter at least nine different symbols.';
  }

  while (alphabet.length < 26) {
    alphabet.forEach(function(a) {
      if (alphabet.length >= 26) {
        return;
      }
      alphabet.forEach(function(b) {
        if (alphabet.indexOf(a + b) === -1) {
          if (alphabet.length >= 26) {
            return;
          }
          alphabet.push(a + b);
        }
      });
    });
  }

  return convert(alphabet, code);
}

var $alphabet = document.getElementById('your-input'),
  $code = document.getElementById('your-code'),
  $preview = document.getElementById('your-output');


function update() {
  var alphabet = $alphabet.value;
  var code = $code.value;
  $preview.innerHTML =  obfuscate(alphabet, code);

  if (alphabet || code) {
    document.location.hash = escape(JSON.stringify({alphabet, code}));
  } else {
    document.location.hash = '';
  }
};

input.addEventListener('keyup', update);

var hash = document.location.hash;

if (hash) {
  hash = JSON.parse(unescape(hash.slice(1)))
} else {
  hash = {};
}

if (hash.alphabet){
  $alphabet.value = hash.alphabet;
} else {
  hash.alphabet = $alphabet.value
}

if (hash.code) {
  $code.value = hash.code;
} else {
  hash.code = $code.value;
}

$preview.innerHTML = obfuscate(hash.alphabet, hash.code);

document.getElementById('run').addEventListener('click', function(event) {
  event.preventDefault();
  eval($preview.innerHTML);
});

const $presets = document.getElementById('presets');

const presets = {
  'Kanji': '零壱弐参四五六七記号符号標識暗号合言葉難読化秘密不可解',
  'Karian': '𐊣𐊦𐊧𐊨𐊭𐊳𐊵𐊶𐊷𐊸𐊺𐊻𐊼𐊽𐊾𐊿𐋀𐋁𐋂𐊫𐋄𐋅𐋇𐋈𐋎𐋐',
  'Hebrew': 'אבגדהוזחטיכךלמנסעפצקרשתםןףץ',
  'Hieroglyphs': '𓅂𓂀𓁄𓊎𓆣𓊝𓆫𓅬𓇎𓏢𓆗𓃠𓃀𓁺𓆦𓄬𓁣𓏁𓋌𓇲𓆡𓆉𓄦𓄀', 
  'Confuse': 'ˈʽʾꞌˊʺʻˋㆍᆢꓽꓸꓹ'
}

for (let [key, value] of Object.entries(presets)) {
  const link = document.createElement('a');
  link.innerHTML = key;
  link.href = '#' + key;
  link.addEventListener('click', function(event){
    event.preventDefault();
    $alphabet.value = value;
    update();
  });
  $presets.appendChild(link);
  $presets.appendChild(document.createTextNode(' '));
}
