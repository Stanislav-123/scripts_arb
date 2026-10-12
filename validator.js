/**
 * Валидатор для одностраничников.
 * Поля: name, last (только буквы, 2–25 символов), phone (intl-tel-input или маска), email.
 * Скрытые: name="country" value="FR" (код локали/страны в нижнем регистре: fr, ru, en...).
 * При отправке: phone без кода страны, в форму добавляется/обновляется name="phonecc".
 */
(function () {
  'use strict';

  var phoneCodes = {
    ru: { code: 7 },
    en: { code: 1 },
    es: { code: 34 },
    fr: { code: 33 },
    de: { code: 49 },
    it: { code: 39 },
    pt: { code: 351 },
    ja: { code: 81 },
    ko: { code: 82 },
    zh: { code: 86 },
    ar: { code: 966 },
    hi: { code: 91 },
    bn: { code: 880 },
    id: { code: 62 },
    tr: { code: 90 },
    nl: { code: 31 },
    pl: { code: 48 },
    sv: { code: 46 },
    uk: { code: 380 },
    vi: { code: 84 },
    fi: { code: 358 },
    da: { code: 45 },
    no: { code: 47 },
    hu: { code: 36 },
    cs: { code: 420 },
    sk: { code: 421 },
    el: { code: 30 },
    he: { code: 972 },
    th: { code: 66 },
    ro: { code: 40 },
    hr: { code: 385 },
    bg: { code: 359 },
    lt: { code: 370 },
    et: { code: 372 },
    lv: { code: 371 },
    sr: { code: 381 },
    sl: { code: 386 },
    ca: { code: 34 },
    fa: { code: 98 },
    tl: { code: 63 },
    ms: { code: 60 },
    km: { code: 855 },
    hy: { code: 374 },
    az: { code: 994 },
    sq: { code: 355 },
    mk: { code: 389 },
    uz: { code: 998 },
    be: { code: 375 },
    kk: { code: 7 }
  };

  var lang = {
    ru: { error: 'Некорректный номер', nameError: 'Только буквы (2–25)', emailError: 'Некорректный email' },
    en: { error: 'Invalid number', nameError: 'Letters only (2–25)', emailError: 'Invalid email' },
    es: { error: 'Número incorrecto', nameError: 'Solo letras (2–25)', emailError: 'Email incorrecto' },
    fr: { error: 'Numéro invalide', nameError: 'Lettres uniquement (2–25)', emailError: 'Email invalide' },
    de: { error: 'Ungültige Nummer', nameError: 'Nur Buchstaben (2–25)', emailError: 'Ungültige E-Mail' },
    it: { error: 'Numero non valido', nameError: 'Solo lettere (2–25)', emailError: 'Email non valido' },
    pt: { error: 'Número inválido', nameError: 'Apenas letras (2–25)', emailError: 'Email inválido' },
    ja: { error: '無効な番号', nameError: '文字のみ (2–25)', emailError: '無効なメール' },
    ko: { error: '잘못된 번호', nameError: '글자만 (2–25)', emailError: '잘못된 이메일' },
    zh: { error: '无效号码', nameError: '仅字母 (2–25)', emailError: '无效邮箱' },
    ar: { error: 'رقم غير صالح', nameError: 'حروف فقط (2–25)', emailError: 'بريد غير صالح' },
    hi: { error: 'अमान्य संख्या', nameError: 'केवल अक्षर (2–25)', emailError: 'अमान्य ईमेल' },
    bn: { error: 'অবৈধ নম্বর', nameError: 'শুধু অক্ষর (2–25)', emailError: 'অবৈধ ইমেইল' },
    id: { error: 'Nomor tidak valid', nameError: 'Hanya huruf (2–25)', emailError: 'Email tidak valid' },
    tr: { error: 'Geçersiz numara', nameError: 'Sadece harf (2–25)', emailError: 'Geçersiz e-posta' },
    nl: { error: 'Ongeldig nummer', nameError: 'Alleen letters (2–25)', emailError: 'Ongeldige e-mail' },
    pl: { error: 'Nieprawidłowy numer', nameError: 'Tylko litery (2–25)', emailError: 'Nieprawidłowy email' },
    sv: { error: 'Ogiltigt nummer', nameError: 'Endast bokstäver (2–25)', emailError: 'Ogiltig e-post' },
    uk: { error: 'Неправильний номер', nameError: 'Тільки літери (2–25)', emailError: 'Невірний email' },
    vi: { error: 'Số điện thoại không hợp lệ', nameError: 'Chỉ chữ cái (2–25)', emailError: 'Email không hợp lệ' },
    fi: { error: 'Virheellinen numero', nameError: 'Vain kirjaimet (2–25)', emailError: 'Virheellinen sähköposti' },
    da: { error: 'Ugyldigt nummer', nameError: 'Kun bogstaver (2–25)', emailError: 'Ugyldig e-mail' },
    no: { error: 'Ugyldig nummer', nameError: 'Kun bokstaver (2–25)', emailError: 'Ugyldig e-post' },
    hu: { error: 'Érvénytelen szám', nameError: 'Csak betűk (2–25)', emailError: 'Érvénytelen e-mail' },
    cs: { error: 'Neplatné číslo', nameError: 'Pouze písmena (2–25)', emailError: 'Neplatný email' },
    sk: { error: 'Neplatné číslo', nameError: 'Iba písmená (2–25)', emailError: 'Neplatný email' },
    el: { error: 'Μη έγκυρος αριθμός', nameError: 'Μόνο γράμματα (2–25)', emailError: 'Μη έγκυρο email' },
    he: { error: 'מספר לא תקין', nameError: 'רק אותיות (2–25)', emailError: 'אימייל לא תקין' },
    th: { error: 'หมายเลขไม่ถูกต้อง', nameError: 'เฉพาะตัวอักษร (2–25)', emailError: 'อีเมลไม่ถูกต้อง' },
    ro: { error: 'Număr incorect', nameError: 'Doar litere (2–25)', emailError: 'Email incorect' },
    hr: { error: 'Neispravan broj', nameError: 'Samo slova (2–25)', emailError: 'Neispravan email' },
    bg: { error: 'Невалиден номер', nameError: 'Само букви (2–25)', emailError: 'Невалиден email' },
    lt: { error: 'Netinkamas numeris', nameError: 'Tik raidės (2–25)', emailError: 'Netinkamas el. paštas' },
    et: { error: 'Vigane number', nameError: 'Ainult tähed (2–25)', emailError: 'Vigane e-post' },
    lv: { error: 'Nederīgs numurs', nameError: 'Tikai burti (2–25)', emailError: 'Nederīga e-pasta adrese' },
    sr: { error: 'Неправилан број', nameError: 'Само слова (2–25)', emailError: 'Неправилан имејл' },
    sl: { error: 'Neveljavna številka', nameError: 'Samo črke (2–25)', emailError: 'Neveljaven email' },
    ca: { error: 'Número incorrecte', nameError: 'Només lletres (2–25)', emailError: 'Email incorrecte' },
    'pt-BR': { error: 'Número inválido', nameError: 'Apenas letras (2–25)', emailError: 'Email inválido' },
    'zh-TW': { error: '無效號碼', nameError: '僅字母 (2–25)', emailError: '無效信箱' },
    fa: { error: 'شماره نامعتبر', nameError: 'فقط حروف (2–25)', emailError: 'ایمیل نامعتبر' },
    tl: { error: 'Hindi wastong numero', nameError: 'Mga titik lamang (2–25)', emailError: 'Hindi wastong email' },
    ms: { error: 'Nombor tidak sah', nameError: 'Huruf sahaja (2–25)', emailError: 'Email tidak sah' },
    km: { error: 'លេខមិនត្រឹមត្រូវ', nameError: 'អក្សរតែប៉ុណ្ណោះ (2–25)', emailError: 'អ៉ីមែលមិនត្រឹមត្រូវ' },
    hy: { error: 'Անվավեր համար', nameError: 'Միայն տառեր (2–25)', emailError: 'Անվավեր email' },
    az: { error: 'Yanlış nömrə', nameError: 'Yalnız hərflər (2–25)', emailError: 'Yanlış email' },
    sq: { error: 'Numër i pavlefshëm', nameError: 'Vetëm shkronja (2–25)', emailError: 'Email i pavlefshëm' },
    mk: { error: 'Неважечки број', nameError: 'Само букви (2–25)', emailError: 'Неважечки имејл' },
    uz: { error: "Noto'g'ri raqam", nameError: "Faqat harflar (2–25)", emailError: "Noto'g'ri email" },
    be: { error: 'Няправільны нумар', nameError: 'Толькі літары (2–25)', emailError: 'Няправільны email' },
    kk: { error: 'Дұрыс емес нөмір', nameError: 'Тек әріптер (2–25)', emailError: 'Дұрыс емес email' }
  };

  var userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  var langBase = userLang.split('-')[0];
  function msg(key) {
    var L = lang[userLang] || lang[langBase] || lang['en'];
    return (L && L[key]) ? L[key] : (key === 'error' ? 'Invalid number' : key === 'nameError' ? 'Letters only (2–25)' : 'Invalid email');
  }

  var LETTERS_REGEX = /^[a-zA-Zа-яА-ЯёЁ\u00C0-\u024F\u1E00-\u1EFF\s\-']*$/;
  var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  function validateName(val) {
    var v = (val || '').trim();
    return v.length >= 2 && v.length <= 25 && LETTERS_REGEX.test(v);
  }

  function validateEmail(val) {
    return EMAIL_REGEX.test((val || '').trim());
  }

  function digitsOnly(str) {
    return (str || '').replace(/\D/g, '');
  }

  function run() {
    var form = document.querySelector('form');
    if (!form) return;

    var nameInput = form.querySelector('input[name="name"]');
    var lastInput = form.querySelector('input[name="last"]');
    var phoneInputs = form.querySelectorAll('input[name="phone"]');
    var emailInput = form.querySelector('input[name="email"]');
    var countryInput = form.querySelector('input[name="country"]');

    var country = (countryInput && countryInput.value) ? countryInput.value.trim().toLowerCase() : 'en';
    var phoneCode = (phoneCodes[country] && phoneCodes[country].code) ? String(phoneCodes[country].code) : '1';

    // ——— Имя: только буквы, 2–25 ———
    function bindNameFilter(input) {
      if (!input) return;
      input.setAttribute('autocomplete', 'name');
      input.setAttribute('pattern', '.{2,25}');
      input.setAttribute('required', '');
      input.addEventListener('input', function () {
        var val = input.value;
        var filtered = val.replace(/[0-9+]/g, '').replace(/[^a-zA-Zа-яА-ЯёЁ\u00C0-\u024F\u1E00-\u1EFF\s\-']/g, '');
        if (filtered !== val) input.value = filtered;
      });
    }
    bindNameFilter(nameInput);
    bindNameFilter(lastInput);
    if (nameInput) nameInput.setAttribute('autocomplete', 'name');
    if (lastInput) lastInput.setAttribute('autocomplete', 'family-name');

    // ——— Телефон: только цифры и допустимые символы; intl-tel-input при наличии ———
    var phoneInstances = [];
    for (var i = 0; i < phoneInputs.length; i++) {
      (function (phone) {
        phone.type = 'tel';
        phone.setAttribute('autocomplete', 'tel');
        phone.setAttribute('pattern', '.{6,18}');
        phone.setAttribute('required', '');
        phone.addEventListener('input', function () {
          var val = phone.value;
          phone.value = val.replace(/[^0-9\s\-()+]/g, '');
        });

        if (window.intlTelInput && country) {
          var countryToIso = { en: 'us', ca: 'es' };
          var iso = (countryToIso[country] || country).slice(0, 2).toUpperCase();
          var iti = window.intlTelInput(phone, {
            autoFormat: true,
            allowDropdown: false,
            initialCountry: iso,
            nationalMode: true,
            autoPlaceholder: 'aggressive',
            formatOnDisplay: true,
            separateDialCode: false,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.min.js'
          });
          phoneInstances.push({ input: phone, iti: iti });
          phone.addEventListener('input', function () {
            phone.setCustomValidity('');
            if (!iti.isValidNumber()) phone.setCustomValidity(msg('error'));
          });
        }
      })(phoneInputs[i]);
    }

    // ——— Отправка формы ———
    function ensurePhonecc() {
      var existing = form.querySelector('input[name="phonecc"]');
      if (existing) {
        existing.value = phoneCode;
      } else {
        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'phonecc';
        hidden.value = phoneCode;
        form.appendChild(hidden);
      }
    }

    function cleanPhoneForSubmit(phoneEl) {
      var raw = digitsOnly(phoneEl.value);
      if (raw.charAt(0) === '0') raw = raw.substring(1);
      if (raw.indexOf(phoneCode) === 0 && raw.length > phoneCode.length) raw = raw.substring(phoneCode.length);
      phoneEl.value = raw;
    }

    function onFormSubmit(e) {
      e.preventDefault();

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var lastVal = lastInput ? lastInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';

      if (!validateName(nameVal)) {
        alert(msg('nameError'));
        if (nameInput) nameInput.focus();
        return;
      }
      if (lastInput && !validateName(lastVal)) {
        alert(msg('nameError'));
        if (lastInput) lastInput.focus();
        return;
      }

      var phoneValid = true;
      if (phoneInstances.length > 0) {
        for (var j = 0; j < phoneInstances.length; j++) {
          if (!phoneInstances[j].iti.isValidNumber()) {
            phoneValid = false;
            break;
          }
        }
      } else {
        for (var k = 0; k < phoneInputs.length; k++) {
          var digits = digitsOnly(phoneInputs[k].value);
          if (digits.charAt(0) === '0') digits = digits.substring(1);
          if (digits.indexOf(phoneCode) === 0) digits = digits.substring(phoneCode.length);
          if (digits.length < 6) {
            phoneValid = false;
            break;
          }
        }
      }

      if (!phoneValid) {
        alert(msg('error'));
        if (phoneInputs[0]) phoneInputs[0].focus();
        return;
      }

      ensurePhonecc();
      for (var p = 0; p < phoneInputs.length; p++) cleanPhoneForSubmit(phoneInputs[p]);

      if (emailInput && !validateEmail(emailVal)) {
        alert(msg('emailError'));
        emailInput.focus();
        return;
      }

      form.removeEventListener('submit', onFormSubmit);
      form.submit();
    }

    form.addEventListener('submit', onFormSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
